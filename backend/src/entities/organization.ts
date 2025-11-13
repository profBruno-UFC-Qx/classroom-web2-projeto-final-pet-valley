import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", enum: ["ong", "protector"] })
  type: "ong" | "protector";

  @Column({ type: "text", unique: true })
  document: string;

  @Column({ type: "text", enum: ["cpf", "cnpj"] })
  documentType: "cpf" | "cnpj";

  @Column({
    type: "text",
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  })
  status: "pending" | "approved" | "rejected";

  @Column({ type: "text" })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
