*Sistema desenvolvido para processo acadêmico de adoção de animais* 🐶🐱
# 📋 Processo de Adoção

### 1. **Consulta Inicial**
- Usuário envia solicitação de adoção
- Responde perguntas sobre:
  - Família
  - Estilo de vida  
  - Companheiro ideal

### 2. **Entrevista**
- Organization envia link para videochamada
- Agenda data e horário
- Organization marca como concluída após realização

### 3. **Avaliação Domiciliar**
- Usuário informa data/horário para visita
- *Frontend permite alterar endereço (não afeta tabela adoption)*
- Organization confirma visita realizada

### 4. **Contrato de Adoção**
- Organization envia documento
- Usuário "assina" via tela fake
- Status da assinatura é salvo

### 5. **Organização da Viagem**
- Com assinatura concluída, adoção é finalizada
- Usuário informa data para busca do animal
- *Frontend libera telefone da organization para contato alternativo*

---

## ⚙️ Implementação Técnica

### 🔄 Sistema de Passos
- **Função única para avançar etapas**
- Não armazena boolean para cada etapa
- Passo concluído = próximo passo ativo

### ❌ Cancelamento
- Qualquer uma das partes pode cancelar
- Função única de cancelamento
- Apenas status da adoption é alterado

---

## 🗂️ Estrutura do Projeto

```
src/
├── entities/
│   ├── User.ts
│   ├── Organization.ts
│   ├── Animal.ts
│   ├── Notification.ts
│   ├── Address.ts
│   └── Adoption.ts
├── controllers/
│   ├── auth/                 // Só autenticação
│   │   └── auth.controller.ts
│   ├── users/                // Gestão de usuários
│   │   └── user.controller.ts
│   ├── animals/
│   │   └── animals.controller.ts
│   ├── organizations/
│   │   └── organizations.controller.ts
│   └── adoptions/
│       └── adoptions.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── animal.service.ts
│   ├── organization.service.ts
│   ├── address.service.ts
│   ├── notification.service.ts
│   └── adoption.service.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── role.middleware.ts
│   └── error.middleware.ts
├── routes/
│   ├── auth.routes.ts        // Rotas de auth
│   ├── users.routes.ts       // Rotas de users
│   ├── animal.routes.ts
│   ├── organization.routes.ts
│   ├── notification.routes.ts
│   ├── address.routes.ts
│   ├── adoption.routes.ts
│   ├── dashboard.routes.ts   // Pega de outros controllers
│   └── index.ts
├── types/
│   ├── express/
│   │   └── index.d.ts  // extends Request
│   ├── auth.types.ts
│   └── api.types.ts
├── utils/
│   ├── database.ts
│   ├── passwordUtils.ts
│   ├── validation.ts
│   └── constants.ts
└── app.ts
```

---

## 🗄️ Entidades do Sistema

### 👤 User
```typescript
{
  id: string
  role: 'admin' | 'adopter'
  name: string
  document: string
  phone: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}
```

### 🏢 Organization
```typescript
{
  id: string
  name: string
  type: 'ong' | 'protector'
  document: number  // CPF ou CNPJ
  documentType: 'cpf' | 'cnpj'
  status: 'pending' | 'approved' | 'rejected'
  phone: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}
```

### 📍 Address
```typescript
{
  id: string
  ownerId: string
  cep: number
  street: string
  neighborhood: string
  city: string
  state: string
  houseNumber: number
  complement: string
}
```

### 🔔 Notification
```typescript
{
  id: string,
  ownerId: string,
  title: string,
  message: string,
  read: boolean,
  createdAt: Date
}
```

### 📝 Adoption
```typescript
{
  id: string
  animalId: string
  adopterUserId: string
  organizationId: string
  status: active | completed | cancelled
  currentStep: number
  
  // passo 1
  initialInquiry_answers: json
  initialInquiry_submittedAt: date
  
  // passo 2
  interview_meetingLink: string
  interview_scheduledDate: date
  interview_completedAt: date
  
  // passo 3
  homeVisit_scheduledDate: date
  homeVisit_completed: boolean
  homeVisit_completedAt: date
  
  // passo 4
  contract_documentSent: boolean
  contract_documentSigned: boolean
  contract_signedAt: date
  contract_signatureData: string
  
  // passo 5
  travelArrangements_scheduledDate: date
  cancelledBy: user | admin
  cancellationReason: string
  createdAt: date
  updatedAt: date
}
```

### 🐾 Animal
```typescript
{
  id: string
  organizationId: string
  name: string
  species: string
  breed: string
  age: number
  size: number
  description: string 
  vaccinated: boolean
  neutered: boolean
  specialNeeds: string
  status: available | adopted | pending
  images: json // é um array de strings
}
```
---

## **Auth Service**
- `register(userData)` - Registro de usuário comum (adopter)
- `registerOrganization(orgData)` - Registro de organização
- `login(credentials)` - Autenticação JWT
- `refreshToken(refreshToken)` - Renovação de token
- `getUserProfile(userId)` - Perfil do usuário logado

## **User Service**
- `updateUser(userId, updateData)` - Atualizar perfil
- `changePassword(userId, passwords)` - Alterar senha
- `listUsers(filters, pagination)` - (Admin) Listar usuários com paginação

## **Organization Service**
- `createOrganization(orgData, userId)` - Criar organização (status: pending)
- `updateOrganization(orgId, updateData)` - Atualizar organização
- `getOrganization(orgId)` - Buscar organização por ID
- `listOrganizations(filters, pagination)` - Listar organizações com filtros e paginação
- `approveOrganization(orgId, adminId)` - (Admin) Aprovar organização
- `rejectOrganization(orgId, adminId, reason)` - (Admin) Rejeitar organização

## **Animal Service** ✅ **CRUD Principal**
- `createAnimal(animalData, organizationId)` - Criar animal
- `updateAnimal(animalId, updateData)` - Atualizar animal
- `deleteAnimal(animalId)` - Excluir animal
- `getAnimal(animalId)` - Buscar animal por ID
- `listAnimals(filters, pagination)` ✅ **Endpoint com paginação e filtros**
- `updateAnimalStatus(animalId, status)` - Mudar status do animal

## **Adoption Service** ✅ **CRUD Dependente + Processo**
- `startAdoption(animalId, adopterUserId, initialAnswers)` - Iniciar processo (etapa 1)
- `getAdoption(adoptionId)` - Buscar adoção por ID
- `updateAdoptionStep(adoptionId, stepData)` - Avançar etapa
- `cancelAdoption(adoptionId, cancelledBy, reason)` - Cancelar adoção
- `listUserAdoptions(userId, pagination)` - Listar adoções do usuário
- `listOrganizationAdoptions(organizationId, pagination)` - Listar adoções da organização

### **Funções Específicas do Processo:**
- `scheduleInterview(adoptionId, meetingLink, scheduledDate)` - Etapa 2 (Organization)
- `completeInterview(adoptionId)` - Concluir entrevista (Organization)
- `scheduleHomeVisit(adoptionId, scheduledDate)` - Etapa 3 (User)
- `completeHomeVisit(adoptionId)` - Confirmar visita (Organization)
- `sendContract(adoptionId)` - Etapa 4 (Organization)
- `signContract(adoptionId, signatureData)` - Assinar contrato (User)
- `scheduleTravel(adoptionId, scheduledDate)` - Etapa 5 (User)
- `completeAdoption(adoptionId)` - Finalizar adoção (Organization)

## **Address Service**
- `createAddress(addressData, ownerId)` - Criar endereço
- `updateAddress(addressId, updateData)` - Atualizar endereço
- `deleteAddress(addressId)` - Excluir endereço
- `getUserAddresses(userId)` - Listar endereços do usuário

## **Notification Service**
- `createNotification(notificationData)` - Criar notificação
- `getUserNotifications(userId, pagination)` - Listar notificações do usuário
- `markAsRead(notificationId)` - Marcar como lida
- `markAllAsRead(userId)` - Marcar todas como lidas

## **Dashboard Service** (Opcional)
- `getUserStats(userId)` - Estatísticas do usuário
- `getOrganizationStats(organizationId)` - Estatísticas da organização
- `getAdminStats()` - Estatísticas gerais (Admin)

---

## **Endpoints Principais por Controller:**

### **Auth Controller**
- `POST /auth/register`
- `POST /auth/register-organization`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `GET /auth/me`

### **Users Controller**
- `PUT /users/profile`
- `PUT /users/password`
- `GET /users` ✅ (Admin - com paginação)

### **Animals Controller** ✅ **CRUD Principal**
- `POST /animals`
- `PUT /animals/:id`
- `DELETE /animals/:id`
- `GET /animals/:id`
- `GET /animals` ✅ **Endpoint com paginação e filtros**

### **Organizations Controller**
- `POST /organizations`
- `PUT /organizations/:id`
- `GET /organizations/:id`
- `GET /organizations` ✅ (com paginação e filtros)
- `PATCH /organizations/:id/approve` (Admin)
- `PATCH /organizations/:id/reject` (Admin)

### **Adoptions Controller** ✅ **CRUD Dependente**
- `POST /adoptions`
- `GET /adoptions/:id`
- `PATCH /adoptions/:id/step`
- `PATCH /adoptions/:id/cancel`
- `GET /users/:userId/adoptions` ✅ (com paginação)
- `GET /organizations/:orgId/adoptions` ✅ (com paginação)

### **Specific Adoption Steps:**
- `PATCH /adoptions/:id/interview`
- `PATCH /adoptions/:id/interview-complete`
- `PATCH /adoptions/:id/home-visit`
- `PATCH /adoptions/:id/home-visit-complete`
- `PATCH /adoptions/:id/contract`
- `PATCH /adoptions/:id/contract-sign`
- `PATCH /adoptions/:id/travel`
- `PATCH /adoptions/:id/complete`

### **Address Controller**
- `POST /addresses`
- `PUT /addresses/:id`
- `DELETE /addresses/:id`
- `GET /addresses`

### **Notifications Controller**
- `GET /notifications` ✅ (com paginação)
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`