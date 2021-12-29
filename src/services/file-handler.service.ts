import {BindingScope, ContextTags, inject, injectable, Provider} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import multer from 'multer';
import path from 'path';
import {FILE_UPLOAD_HANDLER, STORAGE_DIRECTORY} from '../keys';
import {FileUploadHandler} from '../types';

/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
@injectable({
  scope: BindingScope.TRANSIENT,
  tags: {[ContextTags.KEY]: FILE_UPLOAD_HANDLER},
})
export class FileUploadProvider implements Provider<FileUploadHandler> {
  constructor(
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
    @inject(SecurityBindings.USER, {optional: true}) public user: UserProfile
  ) {
  }

  value(): FileUploadHandler {
    console.log(this.user);
    return multer({
      storage: multer.diskStorage({
        destination: path.join(__dirname, this.storageDirectory),
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      })
    }).any();
  }
}
