import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { createTaskDTO } from './dto/task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name); // Using global logger

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private readonly redisCacheService: RedisService,
  ) {}

  async getAllTasks(user: User): Promise<Task[]> {
    return await this.taskRepository.find({ where: { user } });
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const cachedTask: Task = (await this.redisCacheService.getCache(
      `${id}-${user.id}`,
    )) as Task;
    this.logger.log('cachedTask', cachedTask);
    if (cachedTask) {
      this.logger.log('Returning from cache');
      return cachedTask;
    }

    const found = await this.taskRepository.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }

    await this.redisCacheService.setCache(
      `${id}-${user.id}`,
      JSON.stringify(found),
    );

    return found;
  }

  async createTask(createTaskDTO: createTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);

    return task;
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const deleted = await this.taskRepository.delete({ id, user });
    if (deleted.affected == 0) {
      throw new NotFoundException(`ID ${id} is invalid!`);
    }
  }
}
