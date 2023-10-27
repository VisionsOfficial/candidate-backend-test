import { Request, Response } from 'express';
import { Contract } from '../../schemas/schemas';
import { logger } from '../../utils/logger';

export async function signContract(req: Request, res: Response) {
    try {
        const { contractId } = req.params;
        const contractFound = await Contract.findById(contractId);
        if (!contractFound) {
            logger.error(
                `${
                    req.ip
                } PUT /contracts/:contractId/sign ${new Date().toISOString()}`,
                { contractId, event: 'Not found' }
            );
            return res.status(404).json('Contract not found');
        }
        const statusNotSignedOrRevoked = new RegExp(`signed|revoked`);
        // if contract status signed or revoked, not updatable anymore
        if (statusNotSignedOrRevoked.test(contractFound.status)) {
            logger.error(
                `${
                    req.ip
                } PUT /contracts/:contractId/sign ${new Date().toISOString()}`,
                {
                    contractId,
                    event: `Contract can't be modified. Status: ${contractFound.status}`,
                }
            );
            return res
                .status(400)
                .json(
                    `Contract can't be modified. Status: ${contractFound.status}`
                );
        }
        // TODO: Here should go a logic of checking if condition match
        // need more knowledge about ODRL
        const { requesterId } = req.body;
        if (contractFound.consumerId.toString() === requesterId) {
            contractFound.consumerSignature = true;
        } else if (contractFound.providerId.toString() === requesterId) {
            contractFound.providerSignature = true;
        } else {
            logger.error(
                `${
                    req.ip
                } PUT /contracts/:contractId/sign ${new Date().toISOString()}`,
                {
                    contractId,
                    event: 'Participant is not part of the contract',
                }
            );
            return res
                .status(401)
                .json('Participant is not part of the contract');
        }
        if (
            contractFound.providerSignature &&
            contractFound.consumerSignature
        ) {
            contractFound.status = 'signed';
        }
        await contractFound.save();
        logger.info(
            `${
                req.ip
            } PUT /contracts/:contractId/sign ${new Date().toISOString()}`
        );
        return res.status(200).json(contractFound);
    } catch (error) {
        logger.error(error);
        return res.status(400).json('Bad request');
    }
}
