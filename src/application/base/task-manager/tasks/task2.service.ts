import { Injectable } from '@nestjs/common';

@Injectable()
export class Task2Service {
  sayHello() {
    console.log('hello2');
    return;
  }
}
