import { Request , Response , NextFunction } from 'express';
import { adminAuth } from '../lib/firebase';

export const verifyAuth = async (req : Request, res : Response, next : NextFunction) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  try {
    console.log((req.session as any))
    if (!idToken && !(req.session as any).user) {
      console.error('No token and no session provided');
      return res.status(401).json({ error: 'No token and no session provided' });
    } else if (!idToken) {
      console.log("verified from session");
      next();
    } else {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      req.user = decodedToken; 
      console.log("verified");
      next(); 
    }
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return res.status(401).json({ error: 'Invalid ID token' });
  }
};
