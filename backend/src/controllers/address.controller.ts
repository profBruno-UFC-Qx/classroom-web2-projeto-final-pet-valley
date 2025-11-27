import { Request, Response } from 'express';
import { AddressService } from '../services/address.service';
import { AuthenticatedRequest } from '../types/auth.types';

const addressService = new AddressService();

export const createAddress = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Usuário só pode criar endereço para si mesmo
        if (req.user?.id !== req.body.ownerId) {
            return res.status(403).json({ message: 'You can only create address for yourself' });
        }

        const address = await addressService.createAddress(req.body);
        res.status(201).json(address);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getMyAddress = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const ownerId = req.user!.id;
        const address = await addressService.getAddressByOwnerId(ownerId);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json(address);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const checkHasAddress = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const ownerId = req.user!.id;
        const hasAddress = await addressService.hasAddress(ownerId);

        res.status(200).json({ hasAddress });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAddress = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const ownerId = req.user!.id;

        // Verificar se o endereço pertence ao usuário
        const address = await addressService.getAddressByOwnerId(ownerId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const updatedAddress = await addressService.updateAddress(ownerId, req.body);
        res.status(200).json(updatedAddress);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAddress = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const ownerId = req.user!.id;

        // Verificar se o endereço pertence ao usuário
        const address = await addressService.getAddressByOwnerId(ownerId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const result = await addressService.deleteAddress(ownerId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAddressById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const address = await addressService.getAddressById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Apenas o dono do endereço ou admin pode ver
        if (req.user?.role !== 'admin' && req.user?.id !== address.ownerId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(address);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};