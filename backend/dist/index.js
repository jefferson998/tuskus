"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const db_1 = require("./db");
async function main() {
    try {
        await (0, db_1.connectDB)().catch(console.dir);
        app_1.default.listen(config_1.PORT);
        console.log(`Listening on port http://localhost:${config_1.PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    }
    catch (error) {
        console.error(error);
    }
}
main();
//# sourceMappingURL=index.js.map