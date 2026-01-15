import { Request, Response } from "express";
import { OrganizationService } from "../services/organization.service";
import { AuthenticatedRequest } from "../interface/auth.interface";

const organizationService = new OrganizationService();

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const organization = await organizationService.createOrganization(req.body);
    res.status(201).json(organization);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filters = {
      name: req.query.name as string | undefined,
      document: req.query.document as string | undefined,
      email: req.query.email as string | undefined,
    };

    const result = await organizationService.getAllOrganizations(page, limit, filters);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganization = async (req: Request, res: Response) => {
  try {
    const organization = await organizationService.getOrganizationById(
      req.params.id
    );
    res.status(200).json(organization);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getOrganizationToken = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organization = await organizationService.getOrganizationById(
      req.user!.id
    );
    res.status(200).json(organization);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await organizationService.getSelectOrganizations();
    res.status(200).json(organizations);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const approveOrganization = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const organization = await organizationService.approveOrganization(
      req.params.id,
      req.user!.id
    );
    res.status(200).json(organization);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectOrganization = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { reason } = req.body;
    const organization = await organizationService.rejectOrganization(
      req.params.id,
      req.user!.id,
      reason
    );
    res.status(200).json(organization);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrganization = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const organization = await organizationService.updateOrganization(
      req.params.id,
      req.body
    );
    res.status(200).json(organization);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const result = await organizationService.updatePassword(id, newPassword);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrganization = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const result = await organizationService.deleteOrganization(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
