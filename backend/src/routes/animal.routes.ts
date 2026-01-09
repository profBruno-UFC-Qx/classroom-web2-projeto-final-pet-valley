import { Router } from 'express';
import {
    createAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    deleteAnimal,
    getOrganizationAnimals,
    searchAnimals
} from '../controllers/animal.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdminOrOrganization } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Rotas públicas
router.get('/', getAnimals);
router.get('/search', searchAnimals);
router.get('/:id', getAnimal);
router.get('/organization/:organizationId', getOrganizationAnimals);

// Rotas protegidas
router.post('/', authenticateToken, requireAdminOrOrganization, upload.array('images', 5), createAnimal);
router.put('/:id', authenticateToken, requireAdminOrOrganization, updateAnimal);
router.delete('/:id', authenticateToken, requireAdminOrOrganization, deleteAnimal);

export default router;