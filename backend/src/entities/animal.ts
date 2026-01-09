import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Animal {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  organizationId: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  species: string;

  @Column({ type: "text" })
  breed: string;

  @Column({ type: "text", enum: ["macho", "femea"] })
  sex: "macho" | "femea";

  @Column({ type: "integer" })
  age: number;

  @Column({ type: "float" })
  size: number;

  @Column({ type: "float" })
  weight: number;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "boolean" })
  vaccinated: boolean;

  @Column({ type: "boolean" })
  neutered: boolean;

  @Column({ type: "text", nullable: true })
  specialNeeds: string;

  @Column({ type: "text", enum: ["available", "adopted", "pending"] })
  status: "available" | "adopted" | "pending";

  @Column("simple-json")
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
