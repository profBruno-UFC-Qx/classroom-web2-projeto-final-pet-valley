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

router.get('/', getAnimals);

router.get('/organization', authenticateToken, requireAdminOrOrganization, getOrganizationAnimals);

router.get('/search', searchAnimals);

router.get('/:id', getAnimal);

router.post('/', authenticateToken, requireAdminOrOrganization, upload.array('images', 5), createAnimal);

router.put('/:id', authenticateToken, requireAdminOrOrganization, updateAnimal);

router.delete('/:id', authenticateToken, requireAdminOrOrganization, deleteAnimal);


export default router;