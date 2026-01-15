import { Router } from 'express';
import {
  startAdoption,
  getAdoption,
  getUserAdoptions,
  getOrganizationAdoptions,
  scheduleInterview,
  completeInterview,
  scheduleHomeVisit,
  completeHomeVisit,
  sendContract,
  signContract,
  scheduleTravel,
  completeAdoption,
  cancelAdoption
} from '../controllers/adoption.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Rotas públicas (sem autenticação)
// Nenhuma rota pública no momento

// Rotas autenticadas
// Iniciar novo processo de adoção (Passo 1)
router.post('/', authenticateToken, startAdoption);

// Obter detalhes de uma adoção
router.get('/:id', authenticateToken, getAdoption);

// Listar adoções do usuário (adotante)
router.get('/user/:userId/adoptions', authenticateToken, getUserAdoptions);

// Listar adoções da organização
router.get('/organization/:orgId/adoptions', authenticateToken, getOrganizationAdoptions);

// Passo 2: Entrevista
router.patch('/:id/interview', authenticateToken, scheduleInterview);
router.patch('/:id/interview-complete', authenticateToken, completeInterview);

// Passo 3: Avaliação Domiciliar
router.patch('/:id/home-visit', authenticateToken, scheduleHomeVisit);
router.patch('/:id/home-visit-complete', authenticateToken, completeHomeVisit);

// Passo 4: Contrato
router.patch('/:id/contract', authenticateToken, sendContract);
router.patch('/:id/contract-sign', authenticateToken, signContract);

// Passo 5: Viagem/Busca
router.patch('/:id/travel', authenticateToken, scheduleTravel);
router.patch('/:id/complete', authenticateToken, completeAdoption);

// Cancelamento (qualquer momento)
router.patch('/:id/cancel', authenticateToken, cancelAdoption);

export default router;
