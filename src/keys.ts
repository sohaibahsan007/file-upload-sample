import {BindingKey} from '@loopback/core';
import {FileUploadHandler} from './types';

export const FILE_UPLOAD_HANDLER = BindingKey.create<FileUploadHandler>(
  'services.FileUpload',
);

/**
 * Binding key for the storage directory
 */
export const STORAGE_DIRECTORY = BindingKey.create<string>('storage.directory');
