import { Request, Response } from 'express';
import { Contract } from '../../schemas/schemas';
import { logger } from '../../utils/logger';

export async function revokeContract(req: Request, res: Response) {
    try {
        const { contractId } = req.params;
        const contractFound = await Contract.findById(contractId);
        if (!contractFound) {
            logger.error(
                `${
                    req.ip
                } DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`,
                {
                    contractId,
                    event: 'Contract not found',
                }
            );
            return res.status(404).json('Contract not found');
        }
        if (contractFound.status === 'revoked') {
            logger.error(
                `${
                    req.ip
                } DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`,
                {
                    contractId,
                    event: 'Contract already revoked',
                }
            );
            return res.status(400).json('Contract already revoked');
        }
        const { requesterId } = req.body;
        if (
            contractFound.consumerId.toString() !== requesterId &&
            contractFound.providerId.toString() !== requesterId
        ) {
            logger.error(
                `${
                    req.ip
                } DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`,
                {
                    contractId,
                    event: 'Participant id not part of the contract',
                }
            );
            return res
                .status(401)
                .json('Participant id not part of the contract');
        }
        contractFound.status = 'revoked';
        await contractFound.save();
        logger.info(
            `${
                req.ip
            } DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`
        );
        return res
            .status(200)
            .json(`contract ${contractFound._id.toString()} is revoked`);
    } catch (error) {
        logger.error(error);
        return res.status(400).json('Bad request');
    }
}
