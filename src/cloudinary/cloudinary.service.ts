import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'realestate-images' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);

          if (!result) {
            return reject(new Error('upload failed'));
          }
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  async uploadImages(files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }

  async deleteFile(publicId: string) {
    try {
      const res = await cloudinary.uploader.destroy(publicId);

      if (res.result === 'not found')
        throw new NotFoundException('file not found');

      if (res.result !== 'ok')
        throw new InternalServerErrorException('failed to delete file');

      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'could not delete file from cloudinary',
      );
    }
  }
}
