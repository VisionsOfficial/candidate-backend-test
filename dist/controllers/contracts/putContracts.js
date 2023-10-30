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
exports.signContract = void 0;
const schemas_1 = require("../../schemas/schemas");
const logger_1 = require("../../utils/logger");
function signContract(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { contractId } = req.params;
            const contractFound = yield schemas_1.Contract.findById(contractId);
            if (!contractFound) {
                logger_1.logger.error(`${req.ip} PUT /contracts/:contractId/sign ${new Date().toISOString()}`, { contractId, event: 'Not found' });
                return res.status(404).json('Contract not found');
            }
            const statusNotSignedOrRevoked = new RegExp(`signed|revoked`);
            // if contract status signed or revoked, not updatable anymore
            if (statusNotSignedOrRevoked.test(contractFound.status)) {
                logger_1.logger.error(`${req.ip} PUT /contracts/:contractId/sign ${new Date().toISOString()}`, {
                    contractId,
                    event: `Contract can't be modified. Status: ${contractFound.status}`,
                });
                return res
                    .status(400)
                    .json(`Contract can't be modified. Status: ${contractFound.status}`);
            }
            // TODO: Here should go a logic of checking if condition match
            // need more knowledge about ODRL
            const { requesterId } = req.body;
            if (contractFound.consumerId.toString() === requesterId) {
                contractFound.consumerSignature = true;
            }
            else if (contractFound.providerId.toString() === requesterId) {
                contractFound.providerSignature = true;
            }
            else {
                logger_1.logger.error(`${req.ip} PUT /contracts/:contractId/sign ${new Date().toISOString()}`, {
                    contractId,
                    event: 'Participant is not part of the contract',
                });
                return res
                    .status(401)
                    .json('Participant is not part of the contract');
            }
            if (contractFound.providerSignature &&
                contractFound.consumerSignature) {
                contractFound.status = 'signed';
            }
            yield contractFound.save();
            logger_1.logger.info(`${req.ip} PUT /contracts/:contractId/sign ${new Date().toISOString()}`);
            return res.status(200).json(contractFound);
        }
        catch (error) {
            logger_1.logger.error(error);
            return res.status(400).json('Bad request');
        }
    });
}
exports.signContract = signContract;
//# sourceMappingURL=putContracts.js.map