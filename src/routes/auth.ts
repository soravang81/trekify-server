import { Request, Response, Router } from "express";
import { adminAuth } from "../lib/firebase";
import prisma from "../db/db";

const auth = Router();

auth.post('/signin-with-google', async (req: Request, res: Response) => {
  const { idToken } = req.body;
  console.log(idToken)
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    console.log('User ID:', uid);

    // create user in the database , also if exists get userid and save in session
    try {
      const user = await prisma.user.findFirst({ where: { gid : uid } });
      if(user){
        (req.session as any).user = { id : user.id , email : user.email};
        res.send({ message: 'User signed in successfully', id : user.id });
      } else {
        const user = await prisma.user.create({
          data : {
            name : decodedToken.name,
            email : decodedToken.email as string,
            gid : uid
          }
        });
        (req.session as any).user = { id : user.id , email : user.email};
        await req.session.save();
        res.send({ message: 'User signed in successfully', id : user.id });
      }
    } catch(error) {
      console.error('Error creating user:', error);
    }
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ error: 'Invalid ID token' });
  }
});
auth.post("/signup", async (req : Request, res) => {
  const { email, password , name} = req.body;
  try {
    const user = await prisma.user.create({
      data : {
        name,
        email,
        password
      },
      select : {
        id : true,
        email : true
      }
    });
    if(user){
      (req.session as any).user = { 
        id : user?.id , 
        email : user?.email
      };
      req.session.save((err) => {
      if (err) {
        console.error('Failed to save session:', err);
        return res.status(500).send('Internal Server Error');
      }
        console.error('Session saved and user logged in');
      });
      console.log((req.session as any).user)
      res.status(200).json({ 
        success : true,
        user,
        message: "User created successfully" 
      });
    } else {
      res.status(401).json({ error: "Invalid credentials !" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
})
auth.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    const user = await prisma.user.findFirst({
      where : {
        email,
        password
      },
      select : {
        id : true,
        email : true
      }
    });
    if(user){
      (req.session as any).user = { id : user?.id , email : user?.email};
      await req.session.save();
      console.log((req.session as any))
      res.status(200).json({ 
        success : true,
        user,
        message: "Login successfully" 
      });
    } else {
      res.status(401).json({ error: "Invalid credentials !" });
    }

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
})

export default auth