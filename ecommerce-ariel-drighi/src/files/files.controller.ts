import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from '../products/products.service';
import { ImageValidationPipe } from './pipes/image-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly fileService: FilesService,
    private readonly productsService: ProductsService,
  ) {}

  @Post('uploadImage/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 200 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    try {
      const result = (await this.fileService.uploadImage(file)) as {
        secure_url: string;
      };
      const imgUrl = result.secure_url;
      await this.productsService.updateImageUrl(id, imgUrl);
      return { message: 'Imagen subida y URL actualizada con éxito', imgUrl };
    } catch (e) {
      console.error('Error in uploadImage controller:', e);
      throw new HttpException(
        'Error subiendo la imagen',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
