import { Repository } from 'typeorm';
import AppDataSource from '../utils/database';
import { AnimalCreateDto, AnimalUpdateDto } from '../dto/animal.dto';
import { Animal } from '../entities/animal';
import { GitHubPagesService } from './github-pages.service';

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

    async getAnimalsByOrganization(organizationId: string, page: number = 1, limit: number = 10): Promise<{ animals: Animal[], total: number, page: number, totalPages: number }> {
        const skip = (page - 1) * limit;

        const [animals, total] = await this.animalRepository.findAndCount({
            where: { organizationId },
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

    async updateAnimal(id: string, updateData: AnimalUpdateDto): Promise<Animal> {
        const animal = await this.getAnimal(id);

        if (!animal) {
            throw new Error('Animal não encontrado');
        }

        await this.animalRepository.update(id, updateData);
        return (await this.getAnimal(id)) as Animal;
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

    async searchAnimals(filters: {
        species?: string;
        breed?: string;
        sex?: string;
        vaccinated?: boolean;
        // ageMin?: number;
        // ageMax?: number;
        // sizeMin?: number;
        // sizeMax?: number;
        status?: string;
    }, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        let query = this.animalRepository.createQueryBuilder('animal')
            .where('animal.status = :status', { status: 'available' });

        if (filters.species) {
            query = query.andWhere('animal.species = :species', { species: filters.species });
        }

        if (filters.breed) {
            query = query.andWhere('animal.breed LIKE :breed', { breed: `%${filters.breed}%` });
        }

        if (filters.sex) {
            query = query.andWhere('animal.sex = :sex', { sex: filters.sex });
        }

        if (filters.vaccinated !== undefined) {
            query = query.andWhere('animal.vaccinated = :vaccinated', { vaccinated: filters.vaccinated });
        }

        // if (filters.ageMin !== undefined) {
        //     query = query.andWhere('animal.age >= :ageMin', { ageMin: filters.ageMin });
        // }

        // if (filters.ageMax !== undefined) {
        //     query = query.andWhere('animal.age <= :ageMax', { ageMax: filters.ageMax });
        // }

        // if (filters.sizeMin !== undefined) {
        //     query = query.andWhere('animal.size >= :sizeMin', { sizeMin: filters.sizeMin });
        // }

        // if (filters.sizeMax !== undefined) {
        //     query = query.andWhere('animal.size <= :sizeMax', { sizeMax: filters.sizeMax });
        // }

        const [animals, total] = await query
            .skip(skip)
            .take(limit)
            .orderBy('animal.createdAt', 'DESC')
            .getManyAndCount();

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