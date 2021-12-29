import {inject} from '@loopback/core';
import {Request, Response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

export interface IFileUploadService {
  uploadFile(
    request: Request,
    response: Response
  ): Promise<{url: string}>;
}

export class FileUploadService implements IFileUploadService {

  constructor(
    @inject(SecurityBindings.USER) private currentUserProfile: UserProfile
  ) { }

  async uploadFile(
    request: Request,
    response: Response
  ): Promise<{url: string}> {
    return new Promise<{url: string}>((resolve, reject) => {

      const multerRef = multer({
        storage: multer.diskStorage({
          // File directory will be set here
          // Either provide a string
          // destination: path.join(__dirname + '../../.files'),
          // Or function
          // Note: You are responsible for creating the directory when providing destination as a function.
          // When passing a string, multer will make sure that the directory is created for you.
          destination: (req, file, cb) => {
            // Get File extension
            const fileExt = file.originalname.split('.').pop() as string;
            const pathDir = path.join(__dirname + '../../../.files', fileExt, this.currentUserProfile['id']);
            // Create destination directory
            // Use recursive to create sub directories
            fs.mkdir(pathDir, {recursive: true}, (err) => {
              cb(null, pathDir);
            });
          },
          filename: (req, file, cb) => {
            cb(null, file.originalname);
          },
        })
      }).any();

      // This code should be executed after you have finalized destination directory
      multerRef(request, response, (error: unknown) => {
        if (error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          console.log((error as any).message);
          reject({error})
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uploadedFiles = request.files as any[];
        const file = uploadedFiles[0];
        if (file) {
          resolve({url: file.originalname});
        } else {
          reject('File was not found in form data.');
        }
      });
    });
  }

}
