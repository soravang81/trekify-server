import express, { Request } from "express"
import prisma from "../../db/db";
import posts from "./posts";

const community = express.Router();

community.use("/post",posts)

community.get("/" , async (req : Request , res) => {
    try {
        const communities = await prisma.community.findMany()
        res.json(communities)
    } catch (e) {
        console.error(e)
    }
})

community.post("/create" , async (req : Request | any , res ) => {
    try {
        const {
            name , 
            image,
            description , 
            tags,
        }:{ 
            name:string,
            image : string,
            description:string,
            tags:string[]
        } = req.body
        await prisma.community.create({
            data: {
                name , description , image, tags , admin :{
                    create : {
                        userId : req.userId!
                    },
                }, members : {
                    create : {
                        userId : req.userId!
                    }
                }
            }
        })
        res.status(200).send(true)
    } catch (e) {
        res.status(400).send(false)
        console.error(e)
    }
})
export default community