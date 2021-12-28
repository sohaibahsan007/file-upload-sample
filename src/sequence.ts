import {DefaultSequence, RequestContext} from '@loopback/rest';
import {STORAGE_DIRECTORY} from './keys';

export class MySequence extends DefaultSequence {
  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context;
      if (request.path === '/file' && request.query.dirName) {
        context.bind(STORAGE_DIRECTORY).to('../../' + request.query.dirName);
      }
      // The default middleware chain
      await this.invokeMiddleware(context);
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);

      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
