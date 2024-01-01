import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { FileService } from '../service/file.service';
import { Public } from '../../security/auth/decorators/ispublic.decorator';
import { Files } from '../../../../infrastructure/database/entities/Files';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Public()
  @Get('/getFileContent/:guid')
  @ApiOperation({
    summary: 'get file content to show',
  })
  async getFile(@Param('guid') guid: string, @Res() response: Response) {
    const file: Files = await this.fileService.getFileContent(guid);

    response.set({
      'Content-Type': file.fileType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
    });

    response.status(HttpStatus.OK).send(Buffer.from(file.fileStream));

    return response;
  }
}
