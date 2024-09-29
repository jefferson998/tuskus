// const express = require('express');
// const Task = require('../models/Task');
// const auth = require('../middleware/auth');

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


import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/tasks.controllers";
import { auth } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/validator.middleware";
import { createTaskSchema } from "../schemas/task.schema";

const router = Router();

router.get("/tasks", auth, getTasks);

router.post("/tasks", auth, validateSchema(createTaskSchema), createTask);

router.get("/tasks/:id", auth, getTask);

router.put("/tasks/:id", auth, updateTask);

router.delete("/tasks/:id", auth, deleteTask);

export default router;