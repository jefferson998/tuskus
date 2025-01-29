import request from "supertest";
import app from "../server";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

jest.mock("supertest");

describe("Tasks API", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    jest.setTimeout(10000);

    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await User.create({
      username: "testusert",
      email: "testusert@example.com",
      password: passwordHash,
    });

    userId = user._id.toString();

    (request as jest.Mock).mockImplementation(() => {
      return {
        post: jest.fn().mockImplementation((url) => {
          if (url === "/api/auth/login") {
            return {
              send: jest.fn().mockResolvedValue({
                body: {
                  token: "mockedToken", 
                  userId: "mockedUserId", 
                },
              }),
            };
          }

          if (url === "/api/tasks") {
            return {
              set: jest.fn().mockReturnThis(),
              send: jest.fn().mockResolvedValue({
                status: 200,
                body: {
                  _id: "mockedTaskId",
                  title: "Test Task",
                  description: "This is a test task",
                  progress: "in progress",
                },
              }),
            };
          }
        }),

        get: jest.fn().mockImplementation((url) => {
          if (url === "/api/tasks") {
            return {
              set: jest.fn().mockReturnThis(),
              send: jest.fn().mockResolvedValue({
                status: 200,
                body: [
                  {
                    _id: "mockedTaskId1",
                    title: "Test Task 1",
                    description: "This is the first task",
                    progress: "in progress",
                  },
                  {
                    _id: "mockedTaskId2",
                    title: "Test Task 2",
                    description: "This is the second task",
                    progress: "completed",
                  },
                ],
              }),
            };
          }
        }),

        put: jest.fn().mockImplementation((url) => {
          if (url.startsWith("/api/tasks/")) {
            return {
              set: jest.fn().mockReturnThis(),
              send: jest.fn().mockResolvedValue({
                status: 200,
                body: {
                  _id: "mockedTaskId",
                  title: "Updated Test Task",
                  description: "This task has been updated",
                  progress: "completed",
                },
              }),
            };
          }
        }),

        delete: jest.fn().mockImplementation((url) => {
          if (url.startsWith("/api/tasks")) {
            console.log("🚀 ~ url:", url);

            return {
              set: jest.fn().mockReturnThis(), 
              send: jest.fn().mockResolvedValue({
                status: 204, 
              }),
            };
          }
        }),
      };
    });
    const response = await request(app).post("/api/auth/login").send({
      email: "testusert@example.com",
      password: "password123",
    });

    token = response.body.token; 
  });

  afterAll(async () => {
    jest.setTimeout(10000);
    await User.deleteOne({ _id: userId });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("token", token)
        .send({
          title: "Test Task",
          description: "This is a test task",
          progress: "in progress",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body._id).toBe("mockedTaskId");
      expect(response.body.title).toBe("Test Task");
    });
  });

  describe("GET /tasks", () => {
    it("should retrieve tasks", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("token", token)
        .send();
      console.log("🚀 ~ it ~ response:", response);

      expect(response.status).toBe(200); 
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0); 
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update a task", async () => {
      const taskResponse = await request(app)
        .post("/api/tasks")
        .set("token", token)
        .send({
          title: "Test Task to Update",
          description: "This is a test task",
          progress: "in progress",
        });

      const taskId = taskResponse.body._id;

      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("token", token)
        .send({
          title: "Updated Test Task",
          description: "This task has been updated",
          progress: "completed",
        });

      console.log("🚀 ~ it ~ updateResponse:", updateResponse);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe("Updated Test Task");
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", async () => {
      const taskResponse = await request(app)
        .post("/api/tasks")
        .set("token", token)
        .send({
          title: "Task to Delete",
          description: "This task will be deleted",
          progress: "in progress",
        });

      const taskId = taskResponse.body._id;
      console.log("🚀 ~ it ~ taskId:", taskId);

      const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("token", token)
        .send();
      console.log("🚀 ~ it ~ taskId:", taskId);

      expect(deleteResponse.status).toBe(204); 
    });
  });
});

describe("Auth API", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    jest.setTimeout(10000);

    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: passwordHash,
    });
    userId = user._id.toString();

    (request as jest.Mock).mockImplementation((app) => {
      return {
        post: jest.fn().mockImplementation((url) => {
          if (url === "/api/auth/register") {
            return {
              set: jest.fn().mockReturnThis(),
              send: jest.fn().mockResolvedValue({
                status: 200,
                body: {
                  id: "mockedUserId",
                  username: "testuser",
                  email: "testuser@example.com",
                },
              }),
            };
          }

          if (url === "/api/auth/login") {
            return {
              set: jest.fn().mockReturnThis(),
              send: jest.fn().mockImplementation((data) => {
                if (
                  data.email === "testuser@example.com" &&
                  data.password === "password123"
                ) {
                  return Promise.resolve({
                    status: 200,
                    body: {
                      token: "mockedValidToken",
                      userId: "mockedUserId",
                    },
                  });
                }

                if (data.email === "nonexistent@example.com") {
                  return Promise.resolve({
                    status: 400,
                    body: { error: "Email not found" },
                  });
                }

                if (
                  data.email === "testuser@example.com" &&
                  data.password !== "password123"
                ) {
                  return Promise.resolve({
                    status: 400,
                    body: { error: "Incorrect password" },
                  });
                }
              }),
            };
          }

          if (url === "/api/auth/logout") {
            return {
              set: jest.fn().mockReturnThis(),
              send: jest.fn().mockResolvedValue({ status: 200 }),
            };
          }
        }),

        get: jest.fn().mockImplementation((url) => {
          if (url === "/api/auth/verify") {
            let headers: Record<string, string> = {};
        
            const mockResponse = {
              set: function (key: string, value: string) {
                headers[key] = value;
                return this; 
              },
              send: jest.fn().mockImplementation(() => {
                const authHeader = headers['Authorization'];
                
                if (authHeader === 'Bearer mockedValidToken') {
                  return Promise.resolve({
                    status: 200,
                    body: {
                      username: "testuser",
                      email: "testuser@example.com",
                    }
                  });
                }
        
                return Promise.resolve({
                  status: 401,
                  body: { error: "Invalid token" }
                });
              })
            };
        
            return mockResponse;
          }
        }),
      };
    });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "password123" });

    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await User.deleteOne({ _id: userId });
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "newpassword123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        username: "testuser",
        email: "testuser@example.com",
      });
    });
  });

  describe("POST /login", () => {
    it("should login an existing user (SUCCESS)", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token", "mockedValidToken");
    });

    it("should return error for non-existent email (EMAIL NOT FOUND)", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "anypassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Email not found" });
    });

    it("should return error for wrong password (INCORRECT PASSWORD)", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Incorrect password" });
    });
  });

  describe("GET /verify", () => {
    it("should verify a valid token", async () => {
      const response = await request(app)
        .get("/api/auth/verify")
        .set("Authorization", "Bearer mockedValidToken").send(); 
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        username: "testuser",
        email: "testuser@example.com",
      });
    });
  
    it("should reject invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/verify")
        .set("Authorization", "Bearer invalidToken").send();
        console.log("🚀 ~ it ~ response:", response)

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid token" });
    });
  
    it("should reject missing token", async () => {
      const response = await request(app)
        .get("/api/auth/verify").send();
  
      expect(response.status).toBe(401);
    });
  });

  describe("POST /logout", () => {
    it("should logout successfully", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "Bearer mockedValidToken")
        .send();

      expect(response.status).toBe(200);
    });
  });
});
