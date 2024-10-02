"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTask = exports.updateTask = exports.deleteTask = exports.createTask = exports.getTasks = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const getTasks = async (req, res) => {
    try {
        const tasks = await task_model_1.default.find({ user: req.user.id }).populate("user");
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    try {
        const { title, description, progress, date } = req.body;
        const newTask = new task_model_1.default({
            title,
            description,
            progress,
            date,
            user: req.user.id
        });
        await newTask.save();
        res.json(newTask);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createTask = createTask;
const deleteTask = async (req, res) => {
    try {
        const deletedTask = await task_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            res.status(404).json({ message: "Task not found" });
        }
        else {
            res.sendStatus(204);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
};
exports.deleteTask = deleteTask;
const updateTask = async (req, res) => {
    try {
        const { title, description, progress, date } = req.body;
        const taskUpdated = await task_model_1.default.findOneAndUpdate({ _id: req.params.id }, { title, description, progress, date }, { new: true });
        res.json(taskUpdated);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateTask = updateTask;
const getTask = async (req, res) => {
    try {
        const task = await task_model_1.default.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        }
        else {
            res.json(task);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTask = getTask;
