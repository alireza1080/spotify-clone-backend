import { GetAuthReturn } from '@clerk/express/dist/types';

declare global {
  namespace Express {
    export interface Request {
      auth: GetAuthReturn;
    }
  }
}
