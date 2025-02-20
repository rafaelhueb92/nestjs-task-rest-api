import { IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks.model';

export class createTaskDTO {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  title: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  description: string;
}

export class updateTaskDTO {
  title: string;
  description: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
