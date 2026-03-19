import { Injectable } from '@nestjs/common';
import convert from './utils/fileConverter';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  converter(filename:string ): any {
    return convert(filename)
  }
}
