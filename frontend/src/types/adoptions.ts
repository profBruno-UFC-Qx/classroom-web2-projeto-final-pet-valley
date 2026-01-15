export interface InitialInquiryAnswers {
    familyType: string
    lifeStyle: string
    idealCompanion: string
}

export interface AnimalInfo {
    id: string
    name: string
    species: string
    breed: string
    sex: string
    age: number
    size: number
    weight: number
    description: string
    vaccinated: boolean
    neutered: boolean
    specialNeeds: string | null
    status: string
    images: string[]
    createdAt: string
    updatedAt: string
    organizationId: string
}

export interface OrganizationInfo {
    id: string
    name: string
    type: string
    document: string
    documentType: string
    status: string
    phone: string
    email: string
    createdAt: string
    updatedAt: string
}

export interface AdopterInfo {
    id: string
    role: string
    name: string
    document: string
    phone: string
    email: string
    password: string
    createdAt: string
    updatedAt: string
}

export interface Adoption {
    id: string
    status: 'active' | 'completed' | 'cancelled'
    currentStep: number

    // Step 1: Initial Inquiry
    initialInquiry_answers?: InitialInquiryAnswers
    initialInquiry_submittedAt?: string

    // Step 2: Interview
    interview_meetingLink?: string | null
    interview_scheduledDate?: string | null
    interview_completedAt?: string | null

    // Step 3: Home Visit
    homeVisit_scheduledDate?: string | null
    homeVisit_completed: boolean
    homeVisit_completedAt?: string | null

    // Step 4: Contract
    contract_documentSent: boolean
    contract_documentSigned: boolean
    contract_documentContent?: string | null
    contract_signedAt?: string | null
    contract_signatureData?: string | null
    contract_content?: string

    // Step 5: Travel Arrangements
    travelArrangements_scheduledDate?: string | null

    // Cancellation
    cancelledBy?: string | null
    cancellationReason?: string | null

    // Related data
    animal?: AnimalInfo
    organization?: OrganizationInfo
    adopterUser?: AdopterInfo

    createdAt: string
    updatedAt: string
}

export interface CreateAdoptionRequest {
    animal: string; // ID do animal
    organization: string; // ID da organização
    adopterUser: string; // ID do usuário adotante
    initialInquiry_answers: InitialInquiryAnswers
}

export interface ScheduleInterviewRequest {
    meetingLink: string
    scheduledDate: string
}

export interface ScheduleHomeVisitRequest {
    scheduledDate: string
}

export interface SendContractRequest {
    contractContent: string
}

export interface SignContractRequest {
    signatureData: string
}

export interface ScheduleTravelRequest {
    scheduledDate: string
}

export interface CancelAdoptionRequest {
    cancellationReason: string
}

export interface AdoptionsListResponse {
    adoptions: Adoption[]
    total: number
    page: number
    totalPages: number
}
