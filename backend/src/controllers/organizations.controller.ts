import { Request, Response } from "express";
import { OrganizationService } from "../services/organization.service";
import { AuthenticatedRequest } from "../types/auth.types";

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
    const status = req.query.status as string;

    const result = await organizationService.getAllOrganizations(
      page,
      limit,
      status
    );
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
