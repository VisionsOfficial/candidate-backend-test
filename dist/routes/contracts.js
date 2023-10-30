"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractsRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares/");
const controllers_1 = require("../controllers/");
exports.contractsRouter = (0, express_1.Router)();
exports.contractsRouter.get('/', middlewares_1.checkQueryFilter.default, controllers_1.getContracts);
exports.contractsRouter.get('/:id', middlewares_1.checkParamId.default, controllers_1.getContractById);
exports.contractsRouter.post('/', middlewares_1.checkContractPostPayload.default, controllers_1.createContract);
exports.contractsRouter.put('/:contractId/sign', middlewares_1.checkJWT.default, middlewares_1.checkContractPayload.checkParamContractIdAndBodyReqId, controllers_1.signContract);
exports.contractsRouter.delete('/:contractId/revoke', middlewares_1.checkContractPayload.checkParamContractIdAndBodyReqId, controllers_1.revokeContract);
//# sourceMappingURL=contracts.js.map