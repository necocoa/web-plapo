import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    const obj = { message: 'Hello World!' }
    return JSON.stringify(obj)
  }
}
