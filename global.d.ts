import { Express } from 'express-serve-static-core';
import 'express-session';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    userId?: string | number;
  }
}
declare module 'express-session' {
  interface SessionData {
    user?: { id: number; email: string };
  }
}

declare global {
  namespace Express {
    interface Request {
      userId?: string | number;
    }
  }
}

export {};
