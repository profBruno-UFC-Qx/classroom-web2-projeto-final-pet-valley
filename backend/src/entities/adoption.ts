import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Animal } from "./animal";
import { User } from "./user";
import { Organization } from "./organization";

@Entity()
export class Adoption {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Animal)
  @JoinColumn({ name: 'animalId' })
  animal: Animal;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'adopterUserId' })
  adopterUser: User;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column({ type: "text", enum: ["active", "completed", "cancelled"] })
  status: "active" | "completed" | "cancelled";

  @Column({ type: "integer" })
  currentStep: number;

  // passo 1
  @Column("simple-json")
  initialInquiry_answers: Record<string, any>;

  @Column({ type: "datetime" })
  initialInquiry_submittedAt: Date;

  // passo 2
  @Column({ type: "text", nullable: true })
  interview_meetingLink: string;

  @Column({ type: "datetime", nullable: true })
  interview_scheduledDate: Date;

  @Column({ type: "datetime", nullable: true })
  interview_completedAt: Date;

  // passo 3
  @Column({ type: "datetime", nullable: true })
  homeVisit_scheduledDate: Date;

  @Column({ type: "boolean", default: false })
  homeVisit_completed: boolean;

  @Column({ type: "datetime", nullable: true })
  homeVisit_completedAt: Date;

  // passo 4
  @Column({ type: "boolean", default: false })
  contract_documentSent: boolean;

  @Column({ type: "text", default: "" })
  contract_content: string;

  @Column({ type: "boolean", default: false })
  contract_documentSigned: boolean;

  @Column({ type: "datetime", nullable: true })
  contract_signedAt: Date;

  @Column({ type: "text", nullable: true })
  contract_signatureData: string;

  // passo 5
  @Column({ type: "datetime", nullable: true })
  travelArrangements_scheduledDate: Date;

  @Column({ type: "text", enum: ["user", "admin"], nullable: true })
  cancelledBy: "user" | "admin";

  @Column({ type: "text", nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
