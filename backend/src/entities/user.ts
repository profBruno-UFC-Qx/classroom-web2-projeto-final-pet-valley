import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", enum: ["admin", "adopter"] })
  role: "admin" | "adopter";

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", unique: true })
  document: string;

  @Column({ type: "text" })
  phone: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text" })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
