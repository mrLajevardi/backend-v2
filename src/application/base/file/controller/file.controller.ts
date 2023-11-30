import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { FileService } from '../service/file.service';
import { FileUpload } from '../../../../infrastructure/database/entities/FileUpload';
import { Public } from '../../security/auth/decorators/ispublic.decorator';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Public()
  @Get('/getFileContent/:streamId')
  @ApiOperation({
    summary: 'get file content to show',
  })
  async getFile(
    @Param('streamId') streamId: string,
    @Res() response: Response,
  ) {
    const file: FileUpload = await this.fileService.getFileContent(streamId);

    response.set({
      'Content-Type': file.fileType,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });

    response.status(HttpStatus.OK).send(Buffer.from(file.fileStream));

    return response;
  }
}
