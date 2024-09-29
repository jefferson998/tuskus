import Task from "../models/task.model";
import { Request, Response } from "express";

export const getTasks = async (req: any, res:Response):Promise<void> => {
  try {
    const tasks = await Task.find({ user : req.user.id }).populate("user");
    res.json(tasks);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: any, res:Response):Promise<void> => {
  try {
    const { title, description,progress, date } = req.body;
    const newTask = new Task({
      title,
      description,
      progress,
      date,
      user: req.user.id
      
    });
    await newTask.save();
    res.json(newTask);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: any, res: Response):Promise<void> => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask){
      res.status(404).json({ message: "Task not found" });
    }else{
      res.sendStatus(204);
    }
       

    
  } catch (error:any) {
    res.status(500).json({ message: error.message });
    return
  }
};

export const updateTask = async (req: any, res: Response):Promise<void> => {
  try {
    const { title, description, date } = req.body;
    const taskUpdated = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { title, description, date },
      { new: true }
    );

    res.json(taskUpdated);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" }); 
    }else{
      res.json(task);
    }
    
     
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};