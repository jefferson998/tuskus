"use strict";
// const express = require('express');
// const Task = require('../models/Task');
// const auth = require('../middleware/auth');
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// // Crear una nueva tarea
// router.post('/', auth, async (req, res) => {
//   const { name, description, progreso } = req.body;
//   try {
//     const task = new Task({
//       name,
//       description,
//       progreso,
//       userId: req.user.id,
//     });
//     await task.save();
//     res.status(201).json(task);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// // Obtener todas las tareas de un usuario
// router.get('/', auth, async (req, res) => {
//   try {
//     const tasks = await Task.find({ userId: req.user.id });
//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// // Actualizar una tarea
// router.put('/:id', auth, async (req, res) => {
//   const { name, description, progreso } = req.body;
//   try {
//     const task = await Task.findByIdAndUpdate(req.params.id, {
//       name,
//       description,
//       progreso,
//     }, { new: true });
//     if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
//     res.json(task);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// // Eliminar una tarea
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);
//     if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
//     res.json({ message: 'Tarea eliminada' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// module.exports = router;
const express_1 = require("express");
const tasks_controllers_1 = require("../controllers/tasks.controllers");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const task_schema_1 = require("../schemas/task.schema");
const router = (0, express_1.Router)();
router.get("/tasks", auth_middleware_1.auth, tasks_controllers_1.getTasks);
router.post("/tasks", auth_middleware_1.auth, (0, validator_middleware_1.validateSchema)(task_schema_1.createTaskSchema), tasks_controllers_1.createTask);
router.get("/tasks/:id", auth_middleware_1.auth, tasks_controllers_1.getTask);
router.put("/tasks/:id", auth_middleware_1.auth, tasks_controllers_1.updateTask);
router.delete("/tasks/:id", auth_middleware_1.auth, tasks_controllers_1.deleteTask);
exports.default = router;
//# sourceMappingURL=tasks.routes.js.map