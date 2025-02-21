import {
  Body,
  Param,
  Delete,
  Patch,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { createTaskDTO } from './dto/task.dto';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Patch('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, status);
  }

  @Delete('/:id')
  async deleteteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Post()
  async createTask(@Body() createTaskDTO: createTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }
}
