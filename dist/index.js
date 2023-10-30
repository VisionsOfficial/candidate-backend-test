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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = require("swagger-ui-express");
const swaggerDoc_json_1 = __importDefault(require("./docs/swaggerDoc.json"));
const seeder_1 = __importDefault(require("./utils/seeder"));
const logger_1 = require("./utils/logger");
const contracts_1 = require("./routes/contracts");
(0, dotenv_1.config)();
const { DATABASE_URL, SECRET } = process.env;
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get('/ping', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send('pong');
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/contracts', contracts_1.contractsRouter);
// swagger
app.use('/api-docs', swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(swaggerDoc_json_1.default, { explorer: true }));
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!DATABASE_URL || !SECRET) {
            throw Error('Missing database env');
        }
        yield (0, mongoose_1.connect)(DATABASE_URL);
        yield (0, seeder_1.default)();
        logger_1.logger.info(`App running on http://localhost:${PORT}`);
    }
    catch (error) {
        logger_1.logger.error(error);
    }
}));
//# sourceMappingURL=index.js.map