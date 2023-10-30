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
exports.getContractById = exports.getContracts = void 0;
const schemas_1 = require("../../schemas/schemas");
const logger_1 = require("../../utils/logger");
function getContracts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { participantId, status, creation } = req.query;
            let options = {};
            if (participantId) {
                Object.assign(options, {
                    $or: [
                        { providerId: participantId },
                        { consumerId: participantId },
                    ],
                });
            }
            if (status) {
                Object.assign(options, { status });
            }
            if (creation) {
                Object.assign(options, { creation: { $gte: creation } });
            }
            const contracts = yield schemas_1.Contract.find(options);
            logger_1.logger.info(`${req.ip} GET /contracts ${new Date().toISOString()}`);
            res.status(200).json(contracts);
        }
        catch (error) {
            logger_1.logger.error(error);
            res.status(400).end();
        }
    });
}
exports.getContracts = getContracts;
function getContractById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const contractFound = yield schemas_1.Contract.findById(id);
            if (contractFound) {
                res.status(200).json(contractFound);
            }
            else {
                res.status(404).json('Contract not found');
            }
        }
        catch (error) {
            logger_1.logger.error(error);
            res.status(400).json('Bad request');
        }
    });
}
exports.getContractById = getContractById;
//# sourceMappingURL=getContracts.js.map