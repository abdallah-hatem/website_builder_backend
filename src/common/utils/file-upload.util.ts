import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(new BadRequestException('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const videoFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(mp4|webm|ogg|avi|mov)$/)) {
    return callback(new BadRequestException('Only video files are allowed!'), false);
  }
  callback(null, true);
};

export const mediaFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|avi|mov)$/)) {
    return callback(new BadRequestException('Only image and video files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = uuidv4();
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const createMulterOptions = (destination: string, fileFilter: any) => ({
  storage: diskStorage({
    destination: `./uploads/${destination}`,
    filename: editFileName,
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export const getFileType = (filename: string): string => {
  const extension = extname(filename).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
    return 'image';
  } else if (['.mp4', '.webm', '.ogg', '.avi', '.mov'].includes(extension)) {
    return 'video';
  } else {
    return 'file';
  }
};

export const generateFileUrl = (filename: string): string => {
  return `/uploads/${filename}`;
}; 