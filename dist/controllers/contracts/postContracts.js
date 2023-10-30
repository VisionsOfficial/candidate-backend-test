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
exports.createContract = void 0;
const schemas_1 = require("../../schemas/schemas");
const logger_1 = require("../../utils/logger");
function createContract(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { providerId, consumerId, conditions, target } = req.body;
            // checking if both parts exists in db
            const provider = yield schemas_1.Participant.findById(providerId);
            const consumer = yield schemas_1.Participant.findById(consumerId);
            if (!provider || !consumer) {
                return res
                    .status(404)
                    .json('Missing one part or more to create a contract.');
            }
            const newContract = new schemas_1.Contract({
                consumerId,
                providerId,
                conditions,
                target,
            });
            const saved = yield newContract.save();
            logger_1.logger.info(`${req.ip} POST /contracts ${new Date().toISOString()}`);
            return res.status(201).json(saved);
        }
        catch (error) {
            logger_1.logger.error(error);
            return res.status(400).json('Bad request');
        }
    });
}
exports.createContract = createContract;
//# sourceMappingURL=postContracts.js.map