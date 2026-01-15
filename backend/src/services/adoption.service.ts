import { Repository } from 'typeorm';
import AppDataSource from '../utils/database';
import { Adoption } from '../entities/adoption';
import {
    AdoptionStartDto,
    ScheduleInterviewDto,
    ScheduleHomeVisitDto,
    SendContractDto,
    SignContractDto,
    ScheduleTravelDto,
    CancelAdoptionDto
} from '../interface/adoption.interface';
import { AnimalService } from './animal.service';

export class AdoptionService {
    private adoptionRepository: Repository<Adoption>;
    private animalService = new AnimalService();

    constructor() {
        this.adoptionRepository = AppDataSource.getRepository(Adoption);
    }

    async startAdoption(data: AdoptionStartDto): Promise<Adoption> {

        const existingAdoption = await this.adoptionRepository.findOne({
            where: {
                adopterUser: { id: data.adopterUser },
                animal: { id: data.animal }
            }
        });

        if (existingAdoption) {
            throw new Error('Este usuário já possui uma adoção ativa para este animal');
        }

        try {
            const adoption = this.adoptionRepository.create({
                animal: { id: data.animal },
                organization: { id: data.organization },
                adopterUser: { id: data.adopterUser },
                initialInquiry_answers: data.initialInquiry_answers,
                status: 'active',
                currentStep: 1,
                initialInquiry_submittedAt: new Date(),
                homeVisit_completed: false,
                contract_documentSent: false,
                contract_documentSigned: false,
            });

            return await this.adoptionRepository.save(adoption);
        } catch (error) {
            throw new Error(`Erro ao iniciar processo de adoção: ${error}`);
        }
    }

    async getAdoption(adoptionId: string): Promise<Adoption | null> {
        try {
            return await this.adoptionRepository.findOne({
                where: { id: adoptionId },
                relations: ['animal', 'adopterUser', 'organization']
            });
        } catch (error) {
            throw new Error(`Erro ao buscar adoção: ${error}`);
        }
    }

    async getAdoptionBasic(adoptionId: string): Promise<Adoption | null> {
        try {
            return await this.adoptionRepository.findOne({
                where: { id: adoptionId }
            });
        } catch (error) {
            throw new Error(`Erro ao buscar adoção: ${error}`);
        }
    }

    async listUserAdoptions(
        userId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ adoptions: Adoption[]; total: number; page: number; totalPages: number }> {
        try {
            const skip = (page - 1) * limit;

            const [adoptions, total] = await this.adoptionRepository.findAndCount({
                where: { adopterUser: { id: userId } },
                relations: ['animal', 'organization'],
                skip,
                take: limit,
                order: { createdAt: 'DESC' }
            });

            return {
                adoptions,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Erro ao listar adoções do usuário:', error);
            throw error;
        }
    }

    async listOrganizationAdoptions(
        organizationId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ adoptions: Adoption[]; total: number; page: number; totalPages: number }> {
        try {
            const skip = (page - 1) * limit;

            const [adoptions, total] = await this.adoptionRepository.findAndCount({
                where: { organization: { id: organizationId } },
                relations: ['animal', 'adopterUser'],
                skip,
                take: limit,
                order: { createdAt: 'DESC' }
            });

            return {
                adoptions,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Erro ao listar adoções da organização:', error);
            throw error;
        }
    }

    async scheduleInterview(
        adoptionId: string,
        data: ScheduleInterviewDto
    ): Promise<Adoption> {
        try {
            const adoption = await this.getAdoptionBasic(adoptionId);

            if (!adoption) {
                throw new Error('Adoção não encontrada');
            }

            if (adoption.status !== 'active') {
                throw new Error('Adoção não está ativa');
            }

            if (adoption.currentStep !== 1) {
                throw new Error('A adoção não está no passo 1');
            }

            adoption.interview_meetingLink = data.meetingLink;
            adoption.interview_scheduledDate = data.scheduledDate;

            return await this.adoptionRepository.save(adoption);
        } catch (error) {
            throw new Error(`Erro ao agendar entrevista: ${error}`);
        }
    }

    async completeInterview(adoptionId: string): Promise<Adoption> {
        try {
            const adoption = await this.getAdoptionBasic(adoptionId);

            if (!adoption) {
                throw new Error('Adoção não encontrada');
            }

            if (adoption.status !== 'active') {
                throw new Error('Adoção não está ativa');
            }

            if (adoption.currentStep !== 1) {
                throw new Error('A adoção não está no passo 1');
            }

            if (!adoption.interview_scheduledDate) {
                throw new Error('Entrevista não foi agendada');
            }

            adoption.interview_completedAt = new Date();
            adoption.currentStep = 2;

            return await this.adoptionRepository.save(adoption);
        } catch (error) {
            throw new Error(`Erro ao completar entrevista: ${error}`);
        }
    }

    async scheduleHomeVisit(
        adoptionId: string,
        data: ScheduleHomeVisitDto
    ): Promise<Adoption> {
        try {
            const adoption = await this.getAdoptionBasic(adoptionId);

            if (!adoption) {
                throw new Error('Adoção não encontrada');
            }

            if (adoption.status !== 'active') {
                throw new Error('Adoção não está ativa');
            }

            if (adoption.currentStep !== 2) {
                throw new Error('A adoção não está no passo 2');
            }

            adoption.homeVisit_scheduledDate = data.scheduledDate;

            return await this.adoptionRepository.save(adoption);
        } catch (error) {
            throw new Error(`Erro ao agendar avaliação domiciliar: ${error}`);
        }
    }

    async completeHomeVisit(adoptionId: string): Promise<Adoption> {
        try {
            const adoption = await this.getAdoptionBasic(adoptionId);

            if (!adoption) {
                throw new Error('Adoção não encontrada');
            }

            if (adoption.status !== 'active') {
                throw new Error('Adoção não está ativa');
            }

            if (adoption.currentStep !== 2) {
                throw new Error('A adoção não está no passo 2');
            }

            if (!adoption.homeVisit_scheduledDate) {
                throw new Error('Avaliação domiciliar não foi agendada');
            }

            adoption.homeVisit_completed = true;
            adoption.homeVisit_completedAt = new Date();
            adoption.currentStep = 3;

            // Ja adiciona o rascunho do contrato
            adoption.contract_content = `
            TERMO DE ADOÇÃO DE ANIMAL
            Eu, [Nome do Adotante], abaixo assinado, declaro que estou adotando o animal de estimação descrito abaixo, de forma responsável e consciente, comprometendo-me a cuidar dele com amor, respeito e responsabilidade.
            DADOS DO ANIMAL
            Nome: [Nome do Animal]
            Espécie: [Espécie do Animal]
            Raça: [Raça do Animal]
            Idade: [Idade do Animal]
            Sexo: [Sexo do Animal]
            CLÁUSULAS
            O adotante se compromete a fornecer ao animal um lar seguro e adequado, com alimentação, água, abrigo e cuidados veterinários regulares.
            O adotante é responsável por garantir que o animal esteja vacinado e esterilizado/castrado, conforme recomendado pelo veterinário.
            O adotante não irá abandonar ou maltratar o animal, e irá tratá-lo com respeito e carinho.
            O adotante autoriza o [Nome da Instituição] a realizar visitas de acompanhamento para verificar o bem-estar do animal.
            ASSINATURA
            Assinatura do Adotante: ______________________________
            Data: _______________________________________
            OBSERVAÇÕES
            Este documento é um esboço e pode ser modificado conforme necessário.
            É importante consultar um advogado para revisar e validar o documento antes de assiná-lo.
            `;

            return await this.adoptionRepository.save(adoption);
        } catch (error) {
            throw new Error(`Erro ao completar avaliação domiciliar: ${error}`);
        }
    }

    async sendContract(adoptionId: string, data?: SendContractDto): Promise<Adoption> {
        try {
            const adoption = await this.getAdoptionBasic(adoptionId);

            if (!adoption) {
                throw new Error('Adoção não encontrada');
            }

            if (adoption.status !== 'active') {
                throw new Error('Adoção não está ativa');
            }

            if (adoption.currentStep !== 3) {
                throw new Error('A adoção não está no passo 3');
            }

            adoption.contract_content = data?.contractContent || "";
            adoption.contract_documentSent = true;

            return await this.adoptionRepository.save(adoption);
        } catch (error) {
            throw new Error(`Erro ao enviar contrato: ${error}`);
        }
    }

    async signContract(adoptionId: string, data: SignContractDto): Promise<Adoption> {
        try {
            const adoption = await this.getAdoptionBasic(adoptionId);

            if (!adoption) {
                throw new Error('Adoção não encontrada');
            }

            if (adoption.status !== 'active') {
                throw new Error('Adoção não está ativa');
            }

            if (adoption.currentStep !== 3) {
                throw new Error('A adoção não está no passo 3');
            }

            if (!adoption.contract_documentSent) {
                throw new Error('Contrato não foi enviado');
            }

            adoption.contract_documentSigned = true;
            adoption.contract_signedAt = new Date();
            adoption.contract_signatureData = data.signatureData;
            adoption.currentStep = 4;

            return await this.adoptionRepository.save(adoption);
        } catch (error) {
            throw new Error(`Erro ao assinar contrato: ${error}`);
        }
    }

    async scheduleTravel(adoptionId: string, data: ScheduleTravelDto): Promise<Adoption> {
        try {
            const adoption = await this.getAdoptionBasic(adoptionId);

            if (!adoption) {
                throw new Error('Adoção não encontrada');
            }

            if (adoption.status !== 'active') {
                throw new Error('Adoção não está ativa');
            }

            if (adoption.currentStep !== 4) {
                throw new Error('A adoção não está no passo 4');
            }

            if (!adoption.contract_documentSigned) {
                throw new Error('Contrato não foi assinado');
            }

            adoption.travelArrangements_scheduledDate = data.scheduledDate;

            return await this.adoptionRepository.save(adoption);
        } catch (error) {
            throw new Error(`Erro ao agendar viagem: ${error}`);
        }
    }

    async completeAdoption(adoptionId: string): Promise<Adoption> {
        try {
            const adoption = await this.getAdoption(adoptionId); // Com relações

            if (!adoption) {
                throw new Error('Adoção não encontrada');
            }

            if (adoption.status !== 'active') {
                throw new Error('Adoção não está ativa');
            }

            if (adoption.currentStep !== 4) {
                throw new Error('A adoção não está no passo 4');
            }

            if (!adoption.travelArrangements_scheduledDate) {
                throw new Error('Data de viagem não foi agendada');
            }

            adoption.status = 'completed';
            adoption.currentStep = 5;

            // Adotar o animal - agora usando a relação
            await this.animalService.adoptedAnimal(adoption.animal.id);

            const completedAdoption = await this.adoptionRepository.save(adoption);

            // Cancelar todas as outras adoções ativas para o mesmo animal
            const otherAdoptions = await this.adoptionRepository.find({
                where: {
                    animal: { id: adoption.animal.id },
                    status: 'active'
                }
            });

            for (const otherAdoption of otherAdoptions) {
                if (otherAdoption.id !== adoptionId) {
                    otherAdoption.status = 'cancelled';
                    otherAdoption.cancelledBy = 'admin';
                    otherAdoption.cancellationReason = 'Animal já foi adotado por outro usuário';
                    await this.adoptionRepository.save(otherAdoption);
                }
            }

            return completedAdoption;
        } catch (error) {
            throw new Error(`Erro ao completar adoção: ${error}`);
        }
    }

    async cancelAdoption(adoptionId: string, data: CancelAdoptionDto): Promise<Adoption> {
        try {
            const adoption = await this.getAdoptionBasic(adoptionId);

            if (!adoption) {
                throw new Error('Adoção não encontrada');
            }

            if (adoption.status !== 'active') {
                throw new Error('Adoção não está ativa');
            }

            adoption.status = 'cancelled';
            adoption.cancelledBy = data.cancelledBy;
            adoption.cancellationReason = data.cancellationReason;

            return await this.adoptionRepository.save(adoption);
        } catch (error) {
            throw new Error(`Erro ao cancelar adoção: ${error}`);
        }
    }
}