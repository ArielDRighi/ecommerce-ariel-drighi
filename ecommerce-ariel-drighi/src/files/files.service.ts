import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import cloudinary from '../config/cloudinary.config';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class FilesService {
  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resolve_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('Error uploading image to Cloudinary:', error);
            return reject(
              new HttpException(
                'Error uploading image to Cloudinary',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          }
          resolve(result as UploadApiResponse);
        },
      );
      upload.end(file.buffer);
    });
  }
}
