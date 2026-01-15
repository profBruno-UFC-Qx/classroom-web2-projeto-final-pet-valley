export interface AdoptionStartDto {
  animal: string;
  organization: string;
  adopterUser: string;
  initialInquiry_answers: Record<string, any>;
}

export interface ScheduleInterviewDto {
  meetingLink: string;
  scheduledDate: Date;
}

export interface ScheduleHomeVisitDto {
  scheduledDate: Date;
}

export interface SendContractDto {
  contractContent?: string;
}

export interface SignContractDto {
  signatureData: string;
}

export interface ScheduleTravelDto {
  scheduledDate: Date;
}

export interface CancelAdoptionDto {
  cancelledBy: 'user' | 'admin';
  cancellationReason: string;
}

export interface AdoptionResponseDto {
  id: string;
  animalId: string;
  adopterUserId: string;
  organizationId: string;
  status: 'active' | 'completed' | 'cancelled';
  currentStep: number;
  initialInquiry_answers: Record<string, any>;
  initialInquiry_submittedAt: Date;
  interview_meetingLink?: string;
  interview_scheduledDate?: Date;
  interview_completedAt?: Date;
  homeVisit_scheduledDate?: Date;
  homeVisit_completed: boolean;
  homeVisit_completedAt?: Date;
  contract_documentSent: boolean;
  contract_documentSigned: boolean;
  contract_signedAt?: Date;
  contract_signatureData?: string;
  travelArrangements_scheduledDate?: Date;
  cancelledBy?: 'user' | 'admin';
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
