"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server")); // Asegúrate de que esta es la ruta correcta de tu aplicación
const user_model_1 = __importDefault(require("../models/user.model")); // Cambia esto según la estructura de tu proyecto
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
process.env.ENV = 'test';
describe("Tasks API", () => {
    let token;
    let userId;
    beforeAll(async () => {
        await (0, db_1.connectDB)();
        const passwordHash = await bcryptjs_1.default.hash("password123", 10);
        const user = await user_model_1.default.create({
            username: "testusert",
            email: "testusert@example.com",
            password: passwordHash,
        });
        userId = user._id.toString();
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({
            email: user.email,
            password: "password123",
        });
        token = await response.body.token;
    });
    afterAll(async () => {
        await user_model_1.default.deleteOne({ _id: userId });
        await (0, db_1.disconnectDB)();
    });
    describe("POST /tasks", () => {
        it("should create a new task", async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post("/api/tasks")
                .set("token", token)
                .send({
                title: "Test Task",
                description: "This is a test task",
                progress: "in progress",
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.title).toBe("Test Task");
        });
    });
    describe("GET /tasks", () => {
        it("should retrieve tasks", async () => {
            const response = await (0, supertest_1.default)(server_1.default).get("/api/tasks").set("token", token);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });
    describe("PUT /tasks/:id", () => {
        it("should update a task", async () => {
            const taskResponse = await (0, supertest_1.default)(server_1.default)
                .post("/api/tasks")
                .set("token", token)
                .send({
                title: "Test Task to Update",
                description: "This is a test task",
                progress: "in progress",
            });
            const taskId = taskResponse.body._id;
            const updateResponse = await (0, supertest_1.default)(server_1.default)
                .put(`/api/tasks/${taskId}`)
                .set("token", token)
                .send({
                title: "Updated Test Task",
                description: "This task has been updated",
                progress: "completed",
            });
            console.log(updateResponse.body);
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.title).toBe("Updated Test Task");
        });
    });
    describe("DELETE /tasks/:id", () => {
        it("should delete a task", async () => {
            const taskResponse = await (0, supertest_1.default)(server_1.default)
                .post("/api/tasks")
                .set("token", token)
                .send({
                title: "Task to Delete",
                description: "This task will be deleted",
                progress: "in progress",
            });
            const taskId = taskResponse.body._id;
            const deleteResponse = await (0, supertest_1.default)(server_1.default)
                .delete(`/api/tasks/${taskId}`)
                .set("token", token);
            expect(deleteResponse.status).toBe(204);
        });
    });
});
describe('Auth API', () => {
    beforeAll(async () => {
        await (0, db_1.connectDB)();
    });
    afterAll(async () => {
        await user_model_1.default.deleteMany({});
        await (0, db_1.disconnectDB)();
    });
    describe('POST /register', () => {
        it('should register a new user', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.username).toBe('testuser');
            expect(response.body.email).toBe('testuser@example.com');
        });
        it('should return an error if the email is already in use', async () => {
            await (0, supertest_1.default)(server_1.default)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                username: 'testuser2',
                email: 'testuser@example.com', // Intentar registrar el mismo email
                password: 'password123',
            })
                .expect(400);
        });
    });
    describe('POST /login', () => {
        it('should login an existing user', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                email: 'testuser@example.com',
                password: 'password123',
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
        it('should return an error for incorrect password', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                email: 'testuser@example.com',
                password: 'wrongpassword',
            });
            expect(response.status).toBe(400);
        });
        it('should return an error if the email does not exist', async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });
            expect(response.status).toBe(400);
        });
    });
    describe('GET /verify', () => {
        it('should verify a token', async () => {
            const loginResponse = await (0, supertest_1.default)(server_1.default)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                email: 'testuser@example.com',
                password: 'password123',
            });
            const token = loginResponse.body.token;
            const response = await (0, supertest_1.default)(server_1.default)
                .get('/api/auth/verify')
                .set('Cookie', `token=${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('username', 'testuser');
        });
    });
    describe('POST /logout', () => {
        it('should logout the user', async () => {
            const loginResponse = await (0, supertest_1.default)(server_1.default)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                email: 'testuser@example.com',
                password: 'password123',
            });
            const token = loginResponse.body.token;
            const response = await (0, supertest_1.default)(server_1.default)
                .post('/api/auth/logout')
                .set('Cookie', `token=${token}`);
            expect(response.status).toBe(200);
        });
    });
});
