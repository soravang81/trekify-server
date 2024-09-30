import { Request, Response, Router } from "express";
import { adminAuth } from "../lib/firebase";
import prisma from "../db/db";
import { createJwtToken } from '../middleware/authmiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = Router();

auth.post('/signin-with-google', async (req: Request, res: Response) => {
  const { idToken } = req.body;
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    console.log('User ID:', uid);

    try {
      const user = await prisma.user.upsert({
        where: { gid: uid },
        update: {},
        create: {
          name: decodedToken.name || '',
          email: decodedToken.email as string,
          gid: uid
        }
      });

      const token = createJwtToken(user.id);
      console.log("token----------->", token)

      res.send({ message: 'User signed in successfully', id: user.id, token: token , email : user.email, name : user.name, image : user.image});
    } catch (error) {
      console.error('Error creating/updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ error: 'Invalid ID token' });
  }
});

auth.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      },
      select: {
        id: true,
        email: true
      }
    });

    if (user) {
      const token = createJwtToken(user.id);

      res.status(200).json({
        success: true,
        user,
        token,
        message: "User created successfully"
      });
    } else {
      res.status(401).json({ error: "Invalid credentials!" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

auth.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        password
      },
      select: {
        id: true,
        email: true
      }
    });

    if (user) {
      const token = createJwtToken(user.id);

      res.status(200).json({
        success: true,
        user,
        token,
        message: "Login successful"
      });
    } else {
      res.status(401).json({ error: "Invalid credentials!" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

auth.post("/logout", (req: Request, res: Response) => {
  // No need to clear cookies, just send a success response
  res.json({ success: true, message: 'Logged out successfully' });
});

export default auth;