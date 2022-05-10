import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/api/user/user.entity';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
 
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
// export class FilesService {
//   constructor(
//     private readonly configService: ConfigService
//   ) {}
 
  const uploadPublicFile =async (dataBuffer: Buffer, filename: string)=> {
      console.log(AWS_BUCKET_NAME)
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: "library-mgt",
      Body: dataBuffer,
      Key: `${uuid()}-${filename}`
    })
      .promise();
    return uploadResult;
  }
// }

export default uploadPublicFile