"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkParamContractIdAndBodyReqId = void 0;
const mongoose_1 = require("mongoose");
const customError_1 = __importDefault(require("./customError"));
function checkParamContractIdAndBodyReqId(req, res, next) {
    const errors = [];
    if (!req.params.contractId || !(0, mongoose_1.isValidObjectId)(req.params.contractId)) {
        errors.push(new customError_1.default('params', 'contractId', req.params.contractId));
    }
    if (!req.body.requesterId || !(0, mongoose_1.isValidObjectId)(req.body.requesterId)) {
        errors.push(new customError_1.default('body', 'requesterId', req.body.requesterId));
    }
    if (errors.length) {
        return res.status(406).json(errors);
    }
    next();
}
exports.checkParamContractIdAndBodyReqId = checkParamContractIdAndBodyReqId;
//# sourceMappingURL=checkContractPayload.js.map