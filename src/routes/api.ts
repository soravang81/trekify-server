import express, { Request, Response } from "express"
import cors from "cors"
import user from "./api/user";
import community from "./api/community";
import { Router } from 'express';
import { verifyToken } from '../middleware/authmiddleware';
import posts from "./api/posts";

const api = Router();

api.use(express.json())

api.use("/user", user)
api.use("/community", community)
api.use("/posts", posts)

api.get('/protected', verifyToken, (req: Request | any, res: Response) => {
  if (req.userId) {
    res.json({ message: 'This is a protected route', userId: req.userId });
  } else {
    res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }
});

api.post("/", verifyToken, async (req: Request | any, res: Response) => {
    console.log("req.body----------->", req.body.id)
    console.log("req.headers.authorization----------->", req.headers.authorization)
    console.log("req.session----------->", req.session)
    console.log("req.userId----------->", req.userId)
    res.send("hello")
    try {
    } catch (e) {
        console.error(e)
    }
})

export default api
