import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {HttpErrors, post, Request, requestBody, Response, RestBindings} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {FileUploadService} from '../services/file-upload.service';

export class FileUploadController {
  constructor(
    @service(FileUploadService)
    private fileUploadService: FileUploadService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
  ) { }

  @authenticate('jwt')
  @post('/file', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Upload supported document file',
      },
    },
  })
  async upload(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ): Promise<{url: string}> {
    try {
      return await this.fileUploadService.uploadFile(
        request,
        response
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new HttpErrors.Forbidden(error);
    }
  }
}
