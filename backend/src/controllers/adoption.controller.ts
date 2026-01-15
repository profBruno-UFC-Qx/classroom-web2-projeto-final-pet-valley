import { Response } from 'express';
import { AdoptionService } from '../services/adoption.service';
import { AuthenticatedRequest } from '../interface/auth.interface';
import {
    AdoptionStartDto,
    ScheduleInterviewDto,
    ScheduleHomeVisitDto,
    SendContractDto,
    SignContractDto,
    ScheduleTravelDto,
    CancelAdoptionDto
} from '../interface/adoption.interface';

const adoptionService = new AdoptionService();

export const startAdoption = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.role !== 'adopter') {
            return res.status(403).json({
                message: 'Apenas adotantes podem iniciar um processo de adoção'
            });
        }

        const data: AdoptionStartDto = {
            ...req.body,
            adopterUser: req.user.id // Agora é objeto de relação
        };

        const adoption = await adoptionService.startAdoption(data);
        res.status(201).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAdoption = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const adoption = await adoptionService.getAdoption(req.params.id);

        if (!adoption) {
            return res.status(404).json({ message: 'Adoção não encontrada' });
        }

        // Verificar permissão usando as relações
        if (req.user?.role === 'adopter' && adoption.adopterUser?.id !== req.user.id) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        if (req.user?.role === 'organization' && adoption.organization?.id !== req.user.id) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        if (req.user?.role !== 'admin' &&
            req.user?.role !== 'adopter' &&
            req.user?.role !== 'organization') {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserAdoptions = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Verificar se o usuário está acessando suas próprias adoções
        if (req.user?.role === 'adopter' && req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        const userId = req.params.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await adoptionService.listUserAdoptions(userId, page, limit);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrganizationAdoptions = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const orgId = req.params.orgId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await adoptionService.listOrganizationAdoptions(orgId, page, limit);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const scheduleInterview = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const data: ScheduleInterviewDto = req.body;
        const adoption = await adoptionService.scheduleInterview(req.params.id, data);
        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const completeInterview = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.role !== 'organization' && req.user?.role !== 'admin') {
            return res.status(403).json({
                message: 'Apenas organizações ou administradores podem completar entrevista'
            });
        }

        const adoption = await adoptionService.completeInterview(req.params.id);
        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const scheduleHomeVisit = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.role !== 'adopter' && req.user?.role !== 'admin') {
            return res.status(403).json({
                message: 'Apenas adotantes ou administradores podem agendar avaliação domiciliar'
            });
        }

        const data: ScheduleHomeVisitDto = req.body;
        const adoption = await adoptionService.scheduleHomeVisit(req.params.id, data);

        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const completeHomeVisit = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.role !== 'organization' && req.user?.role !== 'admin') {
            return res.status(403).json({
                message: 'Apenas organizações ou administradores podem completar avaliação domiciliar'
            });
        }

        const adoption = await adoptionService.completeHomeVisit(req.params.id);
        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const sendContract = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.role !== 'organization' && req.user?.role !== 'admin') {
            return res.status(403).json({
                message: 'Apenas organizações ou administradores podem enviar contrato'
            });
        }

        const data: SendContractDto = req.body;
        const adoption = await adoptionService.sendContract(req.params.id, data);

        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const signContract = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.role !== 'adopter' && req.user?.role !== 'admin') {
            return res.status(403).json({
                message: 'Apenas adotantes ou administradores podem assinar contrato'
            });
        }

        const data: SignContractDto = req.body;
        const adoption = await adoptionService.signContract(req.params.id, data);

        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const scheduleTravel = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.role !== 'adopter' && req.user?.role !== 'admin') {
            return res.status(403).json({
                message: 'Apenas adotantes ou administradores podem agendar viagem'
            });
        }

        const data: ScheduleTravelDto = req.body;
        const adoption = await adoptionService.scheduleTravel(req.params.id, data);

        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const completeAdoption = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.role !== 'organization' && req.user?.role !== 'admin') {
            return res.status(403).json({
                message: 'Apenas organizações ou administradores podem finalizar adoção'
            });
        }

        const adoption = await adoptionService.completeAdoption(req.params.id);
        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const cancelAdoption = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const data: CancelAdoptionDto = {
            ...req.body,
            cancelledBy: req.user?.role === 'adopter' ? 'user' : 'admin'
        };

        const adoption = await adoptionService.cancelAdoption(req.params.id, data);
        res.status(200).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
