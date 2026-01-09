import { ILike, Repository } from "typeorm";
import AppDataSource from "../utils/database";
import { Organization } from "../entities/organization";
import bcrypt from 'bcrypt';
import { OrganizationUpdateDTO } from "../types/organization.types";

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
      status: "approved",
      // status: "pending", // Sempre começa como pendente
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
    filters?: { name?: string; document?: string; email?: string }
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.name) {
      where.name = ILike(`%${filters.name}%`);
    }
    if (filters?.document) {
      where.document = ILike(`%${filters.document}%`);
    }
    if (filters?.email) {
      where.email = ILike(`%${filters.email}%`);
    }

    const [organizations, total] = await this.organizationRepository.findAndCount({
      where: where,
      skip: skip,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });

    return {
      organizations: organizations.map(organization => {
        const { password, ...organizationWithoutPassword } = organization;
        return organizationWithoutPassword;
      }),
      total,
      page,
      totalPages: Math.ceil(total / limit)
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

  async updateOrganization(id: string, updateData: OrganizationUpdateDTO) {
    const user = await this.organizationRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Organization not found');
    }

    const dataToUpdate: Partial<OrganizationUpdateDTO> = {};

    if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
    if (updateData.document !== undefined) dataToUpdate.document = updateData.document;
    if (updateData.phone !== undefined) dataToUpdate.phone = updateData.phone;
    if (updateData.email !== undefined) dataToUpdate.email = updateData.email;

    if (Object.keys(dataToUpdate).length > 0) {
      await this.organizationRepository.update(id, dataToUpdate);
    }

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
