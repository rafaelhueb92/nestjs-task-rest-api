import {
  Body,
  Param,
  Delete,
  Patch,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { createTaskDTO, updateTaskDTO } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private TasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.TasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.TasksService.getTaskById(id);
  }

  @Patch('/:id')
  updateTask(@Param('id') id: string, @Body() updateTaskDTO: updateTaskDTO) {
    return this.TasksService.updateTask(id, updateTaskDTO);
  }

  @Delete('/:id')
  deleteteTask(@Param('id') id: string) {
    return this.TasksService.deleteTask(id);
  }

  @Post()
  createTask(@Body() createTaskDTO: createTaskDTO) {
    return this.TasksService.createTask(createTaskDTO);
  }
}
