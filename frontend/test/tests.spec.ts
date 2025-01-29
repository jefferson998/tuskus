import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import axios from "axios";

const EMAIL_TEST = process.env.EMAIL_TEST;
const PASSWORD_TEST = process.env.PASSWORD_TEST;
const URL_API_TEST = process.env.URL_API_TEST;
const URL_HOST_TEST = process.env.URL_HOST_TEST;

const login = async (credentials: { email: string; password: string }) => {
  try {
    const api = URL_API_TEST;
    if (!api) throw new Error("URL_API_TEST is not defined");

    const response = await axios.post(`${api}/api/auth/login`, credentials);
    console.log("🚀 ~ login ~ response:", response);

    return response.data.token;
  } catch (error) {
    console.error("Error during login:", error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    } else {
      throw new Error("Unexpected error during login");
    }
  }
};


async function fetchTasks(token: string) {
  const response = await axios.get(`${URL_API_TEST}/api/tasks`, {
    headers: {
      token,
    },
  });
  return response.data;
}

async function registerUser(credentials: {
  username: string;
  email: string;
  password: string;
}) {
  const api = URL_API_TEST;
  const response = await axios.post(`${api}/api/auth/register`, credentials);
  return response.data;
}

test.describe("SignIn Component", () => {
  test.beforeEach(async ({ page }) => {
    console.log("🚀 ~ test.beforeEach ~ URL_HOST_TEST:", URL_HOST_TEST)
    await page.goto(URL_HOST_TEST + "/sign-in",{timeout:50000});
  });

  test("should display error message on failed login", async ({ page }) => {
    await page.fill('input[name="email"]', "invalidemail@mail.com"); 
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    const errorMessage = await page.locator(".bg-red-600");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/The email does not exist/i); 
  });

  test("should redirect on successful login", async ({ page }) => {
    await page.fill('input[name="email"]', EMAIL_TEST); 
    await page.fill('input[name="password"]', PASSWORD_TEST);
    await page.click('button[type="submit"]');

    await page.waitForURL(URL_HOST_TEST + "/user-tasks"); 
    await expect(page).toHaveURL(URL_HOST_TEST + "/user-tasks");
  });

  test("should disable submit button when form is invalid", async ({
    page,
  }) => {
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();

    await page.fill('input[name="email"]', "test@mail.com");
    await expect(submitButton).toBeDisabled();

    await page.fill('input[name="password"]', "Password1234*");
    await expect(submitButton).toBeEnabled();
  });
});

test.describe("TaskUserPage Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL_HOST_TEST + "/user-tasks");
    await page.fill('input[name="email"]', EMAIL_TEST);
    await page.fill('input[name="password"]', PASSWORD_TEST);
    await page.click('button[type="submit"]');
    await page.waitForURL(URL_HOST_TEST + "/user-tasks");
    await expect(page).toHaveURL(URL_HOST_TEST + "/user-tasks");
  });

  test("should add a new task", async ({ page }) => {
    // Agregar una nueva tarea
    const title = faker.person.fullName();
    const description = faker.lorem.paragraph(3);
    await page.click('button:has-text("Agregar Tarea")');
    await page.fill('input[placeholder="Nombre de la tarea"]', title);
    await page.fill('textarea[placeholder="Descripción"]', description);
    await page.fill('input[type="range"]', "50");
    await page.click('button[type="submit"]');

    const taskTitle = await page.locator(`text=${title}`);
    await expect(taskTitle).toBeVisible();
  });

  test("should edit an existing task", async ({ page }) => {
    const credentials = { email: EMAIL_TEST, password: PASSWORD_TEST };
    const token = await login(credentials);

    const tasks = await fetchTasks(token);

    const existingTask = tasks[0];
    const existingTaskTitle = existingTask.title;

    await page.goto(`${URL_HOST_TEST}/user-tasks`);
    await page.click(`button[test-id="edit_${existingTask._id}"]`);

    await page.fill('input[placeholder="Nombre de la tarea"]', "Tarea Editada");

    await page.fill(
      'textarea[placeholder="Descripción"]',
      "Descripción de la tarea editada"
    );

    await page.fill('input[type="range"]', "75");

    await page.click('button:has-text("Guardar Cambios")');

    const editedTasks = await page.locator(`text="Tarea Editada"`);

    await expect(await editedTasks.first()).toHaveText("Tarea Editada");
  });

  test("should delete a task", async ({ page }) => {
    const credentials = { email: EMAIL_TEST, password: PASSWORD_TEST }; 
    const token = await login(credentials);

    const tasks = await fetchTasks(token);
    const existingTask = tasks[0];

    await page.click(`button[test-id="delete_${existingTask._id}"]`); 

    await expect(
      page.locator(`button[test-id="delete_${existingTask._id}"]`)
    ).toBeHidden();
  });
});

test.describe("RegisterPage Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL_HOST_TEST + "/register");
  });

  test("should register a new user successfully", async ({ page }) => {
    const username = faker.internet.username();
    const email = faker.internet.email();
    const password = "Password1234*";

    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirm-password"]', password);

    await page.click('button[type="submit"]');

    await page.waitForURL(`${URL_HOST_TEST}/user-tasks`);
    await expect(page).toHaveURL(`${URL_HOST_TEST}/user-tasks`);
  });

  test("should show error when passwords do not match", async ({ page }) => {
    const username = faker.internet.username();
    const email = faker.internet.email();

    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "Password1234*");
    await page.fill('input[name="confirm-password"]', "DifferentPassword*");

    await page.click('button[type="submit"]');

    const errorMessage = await page.locator("text=Passwords do not match.");
    await expect(errorMessage).toBeVisible();
  });

  test("should show error when email is already registered", async ({
    page,
  }) => {
    const username = faker.internet.username();
    const email = "test@mail.com";
    const password = "Password1234*";

    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', EMAIL_TEST);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirm-password"]', password);

    await page.click('button[type="submit"]');

    const errorMessage = await page.locator("text=The email is already in use");
    await expect(errorMessage).toBeVisible();
  });

  test("should disable submit button when form is invalid", async ({
    page,
  }) => {
    const submitButton = page.locator('button[type="submit"]');

    await expect(submitButton).toBeDisabled();

    await page.fill('input[name="username"]', "testuser");
    await expect(submitButton).toBeDisabled();

    await page.fill('input[name="email"]', "test@mail.com");
    await expect(submitButton).toBeDisabled();

    await page.fill('input[name="password"]', "Password1234*");
    await expect(submitButton).toBeDisabled();

    await page.fill('input[name="confirm-password"]', "Password1234*");
    await expect(submitButton).toBeEnabled(); 
  });
});

test.describe("E2E User Flow", () => {
  test("should register user, add task, edit task, delete task and sign out", async ({
    page,
  }) => {
    // Paso 1: Registrarse
    await page.goto(`${URL_HOST_TEST}/register`);

    const username = faker.internet.username();
    const email = faker.internet.email();
    const password = "Password1234*";

    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirm-password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForURL(`${URL_HOST_TEST}/user-tasks`);
    await expect(page).toHaveURL(`${URL_HOST_TEST}/user-tasks`);

    // Paso 2: Agregar una tarea
    const taskTitle = faker.lorem.words(3);
    const taskDescription = faker.lorem.paragraph(1);

    await page.click('button:has-text("Agregar Tarea")');
    await page.fill('input[placeholder="Nombre de la tarea"]', taskTitle);
    await page.fill('textarea[placeholder="Descripción"]', taskDescription);
    await page.fill('input[type="range"]', "50");
    await page.click('button[type="submit"]');

    const addedTask = await page.locator(`text=${taskTitle}`);
    await expect(addedTask).toBeVisible();

    // Paso 3: Editar la tarea
    const editedTaskTitle = "Tarea Editada";

    await page.locator(`xpath=//button[contains(@test-id,'edit_')]`).click();
    await page.fill('input[placeholder="Nombre de la tarea"]', editedTaskTitle);
    await page.fill(
      'textarea[placeholder="Descripción"]',
      "Descripción de la tarea editada"
    );
    await page.fill('input[type="range"]', "75");
    await page.click('button:has-text("Guardar Cambios")');

    const editedTask = await page.locator(`text="${editedTaskTitle}"`);
    await expect(editedTask).toBeVisible();

    // Paso 4: Eliminar la tarea
    await page.locator(`xpath=//button[contains(@test-id,'delete_')]`).click();
    await expect(page.locator(`text="${editedTaskTitle}"`)).toBeHidden();

    // Paso 5: Cerrar sesión
    await page.click('button:has-text("Cerrar sesión")');
    await expect(page).toHaveURL(`${URL_HOST_TEST}/sign-in`);
  });
});
