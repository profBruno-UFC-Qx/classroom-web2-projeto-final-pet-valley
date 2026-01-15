import { Router } from 'express';
import {
    createAddress,
    getMyAddress,
    checkHasAddress,
    updateAddress,
    deleteAddress,
    getAddressById
} from '../controllers/address.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin, requireAdminOrAdopter } from '../middleware/role.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas para usuário gerenciar seu próprio endereço
router.post('/', createAddress);
router.get('/my-address', getMyAddress);
router.get('/has-address', checkHasAddress);
router.put('/my-address', updateAddress);
router.delete('/my-address', deleteAddress);

// Rota para admin buscar qualquer endereço por ID
router.get('/:id', requireAdmin, getAddressById);

export default router;