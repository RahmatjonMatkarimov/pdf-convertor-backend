import { Controller, Get, Post, UploadedFile, UseInterceptors, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFileSync, unlink } from 'fs';
import { cwd } from 'process';
import path, { join } from 'path';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('converter')
  @UseInterceptors(FileInterceptor('file'))
  converter(@UploadedFile() file: Express.Multer.File): string {
    const filename = `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`
    writeFileSync(join(cwd(), 'uploads', filename), file.buffer)
    return this.appService.converter(filename)
  }

  @Get('uploads/:filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(cwd(), 'uploads', filename);
    res.download(filePath, filename, (err) => {
      if (!err) {
        unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error(unlinkErr);
        });
      }
    });
  }
}
