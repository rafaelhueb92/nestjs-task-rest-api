import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { createTaskDTO } from './dto/task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name); // Using global logger

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private readonly redisCacheService: RedisService,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async getTaskById(id: string): Promise<Task> {
    const cachedTask: Task = (await this.redisCacheService.getCache(
      id,
    )) as Task;
    this.logger.log('cachedTask', cachedTask);
    if (cachedTask) {
      this.logger.log('Returning from cache');
      return cachedTask;
    }

    const found = await this.taskRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }

    await this.redisCacheService.setCache(id, JSON.stringify(found));

    return found;
  }

  async createTask(createTaskDTO: createTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.taskRepository.save(task);

    return task;
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);
    if (deleted.affected == 0) {
      throw new NotFoundException(`ID ${id} is invalid!`);
    }
  }
}
