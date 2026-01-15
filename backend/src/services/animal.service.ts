import { ILike, Repository } from 'typeorm';
import AppDataSource from '../utils/database';
import { Animal } from '../entities/animal';
import { GitHubPagesService } from './github-pages.service';
import { AnimalCreateDto, AnimalUpdateDto } from '../interface/animal.interface';

export class AnimalService {
    private animalRepository: Repository<Animal>;
    private githubService: GitHubPagesService;

    constructor() {
        this.animalRepository = AppDataSource.getRepository(Animal);
        this.githubService = new GitHubPagesService();
    }

    async createAnimal(animalData: AnimalCreateDto, files?: Express.Multer.File[]): Promise<Animal> {
        try {
            // Upload das imagens para o GitHub se houver arquivos
            if (files && files.length > 0) {
                animalData.images = await this.githubService.uploadImages(files);
            } else {
                animalData.images = [];
            }

            const animal = this.animalRepository.create(animalData);
            return await this.animalRepository.save(animal);
        } catch (error) {
            if (animalData.images && animalData.images.length > 0) {
                await Promise.all(
                    animalData.images.map(url => this.githubService.deleteImage(url))
                );
            }
            throw error;
        }
    }

    async getAllAnimals(page: number = 1, limit: number = 10): Promise<{ animals: Animal[], total: number, page: number, totalPages: number }> {
        const skip = (page - 1) * limit;

        const [animals, total] = await this.animalRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' }
        });

        return {
            animals,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getAnimal(id: string): Promise<Animal | null> {
        return await this.animalRepository.findOne({
            where: { id }
        });
    }

    async getAnimalsByOrganization(
        organizationId: string,
        filters: {
            species?: string;
            breed?: string;
            sex?: string;
            vaccinated?: boolean;
            status?: string;
        },
        page: number = 1,
        limit: number = 10
    ): Promise<{ animals: Animal[], total: number, page: number, totalPages: number }> {
        const skip = (page - 1) * limit;

        // Construir objeto where dinamicamente
        const where: any = {
            organizationId // Filtro fixo para organizationId
        };

        // Aplicar filtros com ILike para campos de string
        if (filters.species) {
            where.species = ILike(`%${filters.species}%`);
        }

        if (filters.breed) {
            where.breed = ILike(`%${filters.breed}%`);
        }

        if (filters.sex) {
            where.sex = ILike(`%${filters.sex}%`);
        }

        // Filtros não-string (booleano)
        if (filters.vaccinated !== undefined) {
            where.vaccinated = filters.vaccinated;
        }

        // Se for passado um status no filtro
        if (filters.status) {
            where.status = filters.status;
        }

        const [animals, total] = await this.animalRepository.findAndCount({
            where: where,
            skip: skip,
            take: limit,
            order: {
                createdAt: 'DESC'
            }
        });

        return {
            animals,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async updateAnimal(id: string, updateData: AnimalUpdateDto): Promise<Animal> {
        const animal = await this.getAnimal(id);

        if (!animal) {
            throw new Error('Animal não encontrado');
        }

        const fieldsToUpdate: Record<string, any> = {};
        const allowedFields: (keyof AnimalUpdateDto)[] = [
            'name', 'sex', 'species', 'breed', 'age', 'weight', 'size',
            'description', 'vaccinated', 'neutered', 'specialNeeds'
        ];

        allowedFields.forEach(field => {
            const value = updateData[field];
            if (value !== undefined && value !== '') {
                fieldsToUpdate[field] = value;
            }
        });

        await this.animalRepository.update(id, fieldsToUpdate);
        return (await this.getAnimal(id)) as Animal;
    }

    async adoptedAnimal(id: string): Promise<Animal> {
        const animal = await this.getAnimal(id);
        if (!animal) {
            throw new Error('Animal não encontrado');
        }
        animal.status = 'adopted';
        return await this.animalRepository.save(animal);
    }

    async deleteAnimal(id: string): Promise<{ message: string }> {
        const animal = await this.getAnimal(id);

        if (!animal) {
            throw new Error('Animal não encontrado');
        }

        // Deleta as imagens do Github
        if (animal.images && animal.images.length > 0) {
            await Promise.all(
                animal.images.map(url => this.deleteImageFromUrl(url))
            );
        }

        await this.animalRepository.delete(id);
        return { message: 'Animal deletado com sucesso' };
    }

    async searchAnimals(
        filters: {
            species?: string;
            breed?: string;
            sex?: string;
            vaccinated?: boolean;
            status?: string;
        },
        page: number = 1,
        limit: number = 10
    ) {
        const skip = (page - 1) * limit;

        // Construir objeto where dinamicamente
        const where: any = {
            status: 'available' // Filtro fixo para status
        };

        // Aplicar filtros com ILike para campos de string
        if (filters.species) {
            where.species = ILike(`%${filters.species}%`);
        }

        if (filters.breed) {
            where.breed = ILike(`%${filters.breed}%`);
        }

        if (filters.sex) {
            where.sex = ILike(`%${filters.sex}%`);
        }

        // Filtros não-string (booleano)
        if (filters.vaccinated !== undefined) {
            where.vaccinated = filters.vaccinated;
        }

        // Se for passado um status diferente no filtro, sobrescreve o fixo
        if (filters.status && filters.status !== 'available') {
            where.status = filters.status;
        }

        const [animals, total] = await this.animalRepository.findAndCount({
            where: where,
            skip: skip,
            take: limit,
            order: {
                createdAt: 'DESC'
            }
        });

        return {
            animals,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    private async deleteImageFromUrl(imageUrl: string): Promise<void> {
        try {
            await this.githubService.deleteImage(imageUrl);
        } catch (error) {
            console.error('Erro ao deletar imagem do GitHub:', error);
        }
    }
}