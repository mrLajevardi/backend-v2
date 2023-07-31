import { Injectable } from '@nestjs/common';
import { TaskInterface } from '../../interface/task.interface';
@Injectable()
export class Task1Service implements TaskInterface {
  stepName: 'task1';
  execute() {}
}
