"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
function default_1(req, res, next) {
    let { status, participantId, creation } = req.query;
    const rgStatus = new RegExp(`signed|pending|revoked`);
    if (status && typeof status === 'string' && !rgStatus.test(status)) {
        return res.status(406).json('Invalid query: status');
    }
    if (participantId && !(0, mongoose_1.isValidObjectId)(participantId)) {
        return res.status(406).json('Invalid query: participantId');
    }
    if (creation &&
        (typeof creation !== 'string' ||
            // timestamp ISO string eg: 2023-10-26T16:31:42.464Z
            !new RegExp(/^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/).test(creation))) {
        return res.status(406).json('Invalid query: creation');
    }
    next();
}
exports.default = default_1;
//# sourceMappingURL=queryFilter.js.map