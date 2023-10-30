"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participant = exports.Contract = void 0;
const mongoose_1 = require("mongoose");
exports.Contract = (0, mongoose_1.model)('contract', new mongoose_1.Schema({
    providerId: mongoose_1.Schema.Types.ObjectId,
    consumerId: mongoose_1.Schema.Types.ObjectId,
    providerSignature: { type: mongoose_1.Schema.Types.Boolean, default: false },
    consumerSignature: { type: mongoose_1.Schema.Types.Boolean, default: false },
    target: mongoose_1.Schema.Types.String,
    status: {
        type: mongoose_1.Schema.Types.String,
        default: 'pending',
    },
    conditions: mongoose_1.Schema.Types.Mixed,
    creation: { type: mongoose_1.Schema.Types.Date, default: Date.now() },
    update: { type: mongoose_1.Schema.Types.Date, default: Date.now() },
}));
exports.Participant = (0, mongoose_1.model)('participant', new mongoose_1.Schema({
    name: String,
    token: String,
}));
//# sourceMappingURL=schemas.js.map