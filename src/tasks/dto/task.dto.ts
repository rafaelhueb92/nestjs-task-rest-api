import { TaskStatus } from '../tasks.model';

export class createTaskDTO {
  title: string;
  description: string;
}

export class updateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
}
