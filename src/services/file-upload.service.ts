import {service} from '@loopback/core';
import {Request, Response} from '@loopback/rest';
import {FileUploadHandler} from '../types';
import {FileUploadProvider} from './file-handler.service';

export interface IFileUploadService {
  uploadFile(
    request: Request,
    response: Response
  ): Promise<{url: string}>;
}

export class FileUploadService implements IFileUploadService {

  constructor(
    @service(FileUploadProvider) private handler: FileUploadHandler
  ) { }

  async uploadFile(
    request: Request,
    response: Response
  ): Promise<{url: string}> {
    return new Promise<{url: string}>((resolve, reject) => {
      this.handler(request, response, (error: unknown) => {
        if (error) reject({error});

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uploadedFiles = request.files as any;
        const file = uploadedFiles[0];

        // Check if form data contains file
        if (file) {
          resolve({url: file.originalname});
        } else {
          reject('File was not found in form data.');
        }
      });
    });
  }

}
