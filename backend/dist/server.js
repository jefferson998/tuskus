"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainDB = mainDB;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const db_1 = require("./db");
const app = (0, express_1.default)();
dotenv_1.default.config();
if (config_1.ENV === 'prod') {
    app.use((0, cors_1.default)({
        credentials: true,
        origin: config_1.FRONTEND_URL,
    }));
}
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_1.default);
app.use("/api", tasks_routes_1.default);
async function mainDB() {
    try {
        console.log("ENV :: " + config_1.ENV);
        await (0, db_1.connectDB)().catch(console.dir);
        app.listen(config_1.PORT);
        console.log(`Listening on port http://localhost:${config_1.PORT}`);
        console.log(`Environment: ${config_1.ENV}`);
    }
    catch (error) {
        console.error(error);
    }
}
mainDB();
exports.default = app;
