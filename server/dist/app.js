"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const buyersRoute_1 = __importDefault(require("./routes/buyersRoute"));
const db_1 = require("./db/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
}));
/*=========Routes======== */
app.use('/users', buyersRoute_1.default);
const port = 4000;
app.listen(port, async () => {
    console.log(`server running on http://localhost:${port}`);
    await (0, db_1.connectDB)();
    db_1.sequelize.sync({ force: false }).then(() => {
        console.log("Synced database successfully");
    });
});
exports.default = app;
