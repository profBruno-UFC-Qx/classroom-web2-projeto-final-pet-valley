import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  ownerId: string;

  @Column({ type: "integer" })
  cep: number;

  @Column({ type: "text" })
  street: string;

  @Column({ type: "text" })
  neighborhood: string;

  @Column({ type: "text" })
  city: string;

  @Column({ type: "text" })
  state: string;

  @Column({ type: "integer" })
  houseNumber: number;

  @Column({ type: "text", nullable: true })
  complement: string;
}
