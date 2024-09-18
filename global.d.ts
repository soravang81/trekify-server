import { Express } from 'express-serve-static-core';
import 'express-session';

declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    id: string;
  }
}
declare module 'express-session' {
  interface SessionData {
    user? : {
      id?: string,
      email? : string
    }
  }
}

export {};