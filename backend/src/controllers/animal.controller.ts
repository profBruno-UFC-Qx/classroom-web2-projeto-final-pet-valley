import { Request, Response } from 'express';
import { AnimalService } from '../services/animal.service';
import { AuthenticatedRequest } from '../interface/auth.interface';
import { AnimalCreateDto, AnimalUpdateDto } from '../interface/animal.interface';

const animalService = new AnimalService();

export const createAnimal = async (req: AuthenticatedRequest, res: Response) => {
    try {

        // Verifica se o usuário é uma organização ou admin
        if (req.user?.role !== 'organization' && req.user?.role !== 'admin') {
            return res.status(403).json({
                message: 'Apenas organizações ou administradores podem criar animais'
            });
        }

        // Garante que toda organização só irar criar animais para si mesma
        if (req.user.role === 'organization') {
            req.body.organizationId = req.user.id;
        }

        const animalData: AnimalCreateDto = req.body;
        const files = req.files as Express.Multer.File[];

        const animal = await animalService.createAnimal(animalData, files);
        res.status(201).json(animal);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAnimals = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await animalService.getAllAnimals(page, limit);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAnimal = async (req: Request, res: Response) => {
    try {
        const animal = await animalService.getAnimal(req.params.id);

        if (!animal) {
            return res.status(404).json({ message: 'Animal não encontrado' });
        }

        res.status(200).json(animal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrganizationAnimals = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const organizationId: string = req.user?.id || "";

        const filters = {
            species: req.query.species as string,
            breed: req.query.breed as string,
            sex: req.query.sex as string,
            vaccinated: req.query.vaccinated ? req.query.vaccinated === 'true' : undefined,
            status: req.query.status as string,
        };

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await animalService.getAnimalsByOrganization(organizationId, filters, page, limit);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAnimal = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const animal = await animalService.getAnimal(req.params.id);

        if (!animal) {
            return res.status(404).json({ message: 'Animal não encontrado' });
        }

        const updateData: AnimalUpdateDto = req.body;
        const updatedAnimal = await animalService.updateAnimal(req.params.id, updateData);

        res.status(200).json(updatedAnimal);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAnimal = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const animal = await animalService.getAnimal(req.params.id);

        if (!animal) {
            return res.status(404).json({ message: 'Animal não encontrado' });
        }

        // Verifica permissões
        if (req.user?.role !== 'admin' && req.user?.id !== animal.organizationId) {
            return res.status(403).json({
                message: 'Você não tem permissão para deletar este animal'
            });
        }

        const result = await animalService.deleteAnimal(req.params.id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const searchAnimals = async (req: Request, res: Response) => {
    try {
        const filters = {
            species: req.query.species as string,
            breed: req.query.breed as string,
            sex: req.query.sex as string,
            vaccinated: req.query.vaccinated ? req.query.vaccinated === 'true' : undefined,
            status: req.query.status as string,
        };

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await animalService.searchAnimals(filters, page, limit);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};