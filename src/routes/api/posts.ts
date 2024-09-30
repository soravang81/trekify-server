import { Request, Response, Router } from "express"
import prisma from "../../db/db"

const posts = Router();

const getAllPosts = async (req : Request , res : Response) => {
    try {
        const posts = await prisma.post.findMany()
        res.status(200).json({
            message : "Posts fetched successfully",
            success : true,
            posts
        })
    } catch (e) {
        res.status(500).json({
            message : "Error fetching posts",
            success : false,
            error : e
        })
        console.error(e)
    }
}
const createPost = async (req : Request | any , res : Response) => {
    const {
        text , 
        image , 
        communityId,
        userId
    } = req.body
    try {
        await prisma.post.create({
            data : { 
                text, 
                image, 
                userId : req.userId ?? userId,
                communityId
            }
        })
        res.json({
            message : "Post created successfully",
            success : true
            
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message : "Error creating post",
            success : false,
            error : e
        })
    }
}
const deletePost = async (req : Request | any , res : Response) => {
    const { id } = req.params
    try {
        await prisma.post.delete({
            where : { id }
        })
        res.json({
            message : "Post deleted successfully",
            success : true
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message : "Error deleting post",
            success : false,
            error : e
        })
    }
}
const updatePost = async (req : Request | any , res : Response) => {
    const { id } = req.params
    const { text , image } = req.body
    try {
        await prisma.post.update({
            where : { id },
            data : { text , image }
        })
        res.json({
            message : "Post updated successfully",
            success : true
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message : "Error updating post",
            success : false,
            error : e
        })
    }
}
const getPostsByCommunity = async (req : Request | any , res : Response) => {
    const { id } = req.params
    try {
        const posts = await prisma.post.findMany({
            where : { communityId : id },
            include : {
                comments : {
                    include : {
                        commentedBy : true,
                    }
                },
                likes : true,
                postBy : true,
            }
        })
        res.status(200).json({
            message : "Posts fetched successfully",
            success : true,
            posts
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message : "Error fetching posts",
            success : false,
            error : e
        })
    }
}

posts.post("/create" , createPost)
posts.get("/all", getAllPosts )
posts.delete("/:id" , deletePost)
posts.put("/:id" , updatePost)
posts.get("/:id" , getPostsByCommunity)

export default posts