import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    const maxSize = 200 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
      throw new BadRequestException(
        'El tamaño de la imagen no debe exceder los 200 KB',
      );
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de imagen no permitido');
    }
    return file;
  }
}
