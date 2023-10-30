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
const schemas_1 = require("../schemas/schemas");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { SECRET } = process.env;
// for the sake of simplicity here is 3 participant with their ids, names
// and a token jwt, they are seeded on service start. Check the terminal logs to use it easily
const token = (participantName) => (0, jsonwebtoken_1.sign)({ name: participantName }, SECRET);
const participantsArray = [
    {
        id: '653a5c5670634b213c412d76',
        name: 'participantA',
        token: token('participantA'),
    },
    {
        id: '653a5c5670634b213c412d77',
        name: 'participantB',
        token: token('participantB'),
    },
    {
        id: '653a5c5670634b213c412d78',
        name: 'participantC',
        token: token('participantC'),
    },
];
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        // cleaning participant A and B
        const [nameA, nameB, nameC] = participantsArray.map((p) => p.name);
        const rg = new RegExp(`${nameA}|${nameB}|${nameC}`);
        yield schemas_1.Participant.deleteMany({ name: rg });
        // creating new ones
        for (const p of participantsArray) {
            const prt = new schemas_1.Participant({
                _id: p.id,
                name: p.name,
                token: p.token,
            });
            yield prt.save();
        }
        console.log(yield schemas_1.Participant.find());
    });
}
exports.default = default_1;
//# sourceMappingURL=seeder.js.map