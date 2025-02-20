import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v7 as uuid } from 'uuid';
import { createTaskDTO, updateTaskDTO } from './dto/task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    console.log('task by Id', task, id);
    return task
      ? task
      : { id: '', title: '', description: '', status: TaskStatus['DONE'] };
  }

  createTask(createTaskDTO: createTaskDTO): Task {
    const { title, description } = createTaskDTO;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus['OPEN'],
    };

    this.tasks.push(task);

    return task;
  }

  updateTask(id: string, updateTaskDTO: updateTaskDTO): Task {
    const taskIndex: number = this.tasks.findIndex((task) => task.id == id);
    const { title, description, status } = updateTaskDTO;
    this.tasks[taskIndex].title = title;
    this.tasks[taskIndex].description = description;
    this.tasks[taskIndex].status = status;
    return this.tasks[taskIndex];
  }

  deleteTask(id: string): string {
    const tasks = this.tasks.filter((task) => task.id !== id);
    this.tasks = tasks;
    return id;
  }
}
