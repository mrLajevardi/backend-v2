import { Injectable } from '@nestjs/common';
import { Task2Service } from './task2.service';

@Injectable()
export class Task1Service {
  sayHello() {
    console.log('hello1');
    return;
  }
}
