"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeContract = void 0;
const schemas_1 = require("../../schemas/schemas");
const logger_1 = require("../../utils/logger");
function revokeContract(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { contractId } = req.params;
            const contractFound = yield schemas_1.Contract.findById(contractId);
            if (!contractFound) {
                logger_1.logger.error(`${req.ip} DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`, {
                    contractId,
                    event: 'Contract not found',
                });
                return res.status(404).json('Contract not found');
            }
            if (contractFound.status === 'revoked') {
                logger_1.logger.error(`${req.ip} DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`, {
                    contractId,
                    event: 'Contract already revoked',
                });
                return res.status(400).json('Contract already revoked');
            }
            const { requesterId } = req.body;
            if (contractFound.consumerId.toString() !== requesterId &&
                contractFound.providerId.toString() !== requesterId) {
                logger_1.logger.error(`${req.ip} DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`, {
                    contractId,
                    event: 'Participant id not part of the contract',
                });
                return res
                    .status(401)
                    .json('Participant id not part of the contract');
            }
            contractFound.status = 'revoked';
            yield contractFound.save();
            logger_1.logger.info(`${req.ip} DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`);
            return res
                .status(200)
                .json(`contract ${contractFound._id.toString()} is revoked`);
        }
        catch (error) {
            logger_1.logger.error(error);
            return res.status(400).json('Bad request');
        }
    });
}
exports.revokeContract = revokeContract;
//# sourceMappingURL=deleteContract.js.map