import { Repository } from "typeorm";
import AppDataSource from "../utils/database";
import { Organization } from "../entities/organization";
import bcrypt from 'bcrypt';

export class OrganizationService {
  private organizationRepository: Repository<Organization>;

  constructor() {
    this.organizationRepository = AppDataSource.getRepository(Organization);
  }

  async createOrganization(organizationData: {
    name: string;
    type: "ong" | "protector";
    document: string;
    documentType: "cpf" | "cnpj";
    phone: string;
    email: string;
    password: string;
  }): Promise<Organization> {
    // Verificar se documento já existe
    const existingDoc = await this.organizationRepository.findOne({
      where: { document: organizationData.document },
    });
    if (existingDoc) {
      throw new Error("Document already registered");
    }

    // Verificar se email já existe
    const existingEmail = await this.organizationRepository.findOne({
      where: { email: organizationData.email },
    });
    if (existingEmail) {
      throw new Error("Email already registered");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(organizationData.password, 10);

    const organization = this.organizationRepository.create({
      ...organizationData,
      password: hashedPassword,
      status: "pending", // Sempre começa como pendente
    });

    return await this.organizationRepository.save(organization);
  }

  async approveOrganization(id: string, adminId: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    organization.status = "approved";
    await this.organizationRepository.save(organization);

    return organization;
  }

  async rejectOrganization(id: string, adminId: string, reason?: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    organization.status = "rejected";
    await this.organizationRepository.save(organization);

    return organization;
  }

  async getAllOrganizations(
    page: number = 1,
    limit: number = 10,
    status?: string
  ) {
    const skip = (page - 1) * limit;

    const where: Partial<Organization> = status
      ? { status: status as "pending" | "approved" | "rejected" }
      : {};

    const [organizations, total] =
      await this.organizationRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: "DESC" },
      });

    return {
      organizations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrganizationById(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    return organization;
  }

  async updateOrganization(id: string, updateData: Partial<Organization>) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Não permitir alterar status via update comum
    if (updateData.status) {
      delete updateData.status;
    }

    await this.organizationRepository.update(id, updateData);
    return await this.getOrganizationById(id);
  }

  async deleteOrganization(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    await this.organizationRepository.delete(id);
    return { message: "Organization deleted successfully" };
  }
}
