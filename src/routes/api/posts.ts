import { Request, Response, Router } from "express"
import prisma from "../../db/db"

const posts = Router();

const getAllPosts = async (req : Request , res : Response) => {
    try {
        const posts = await prisma.post.findMany({
            include : {
                comments : {
                    include : {
                        commentedBy : true,
                    }
                },
                likes : true,
                postBy : true,
            },
            orderBy : {
                createdAt : 'desc'
            }
        })
        res.status(200).json({
            message : "Posts fetched successfully",
            success : true,
            posts
        })
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            message: "Error fetching posts",
            success: false,
            error: error
        });
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
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            message: "Error creating post",
            success: false,
            error: error
        });
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
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            message: "Error deleting post",
            success: false,
            error: error
        });
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
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            message: "Error updating post",
            success: false,
            error: error
        });
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
    } catch (error) {
        console.error('Error fetching posts by community:', error);
        res.status(500).json({
            message: "Error fetching posts",
            success: false,
            error: error
        });
    }
}
const likePost = async (req : Request | any , res : Response) => {
    const { id } = req.params
    const { userId } = req.body
    try {
        await prisma.postLike.create({
            data : {
                postId : id,
                userId : req.userId ?? userId
            }
        })
        res.status(200).json({
            message : "Post liked successfully",
            success : true
        })
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({
            message: "Error liking post",
            success: false,
            error: error
        });
    }
}
const unlikePost = async (req : Request | any , res : Response) => {
    const { id } = req.params
    const { userId } = req.body
    try {
        await prisma.postLike.deleteMany({
            where: {
                AND : [
                    {
                        postId : id
                    },
                    {
                        userId : req.userId ?? userId
                    }
                ]
            }
        })
        res.status(200).json({
            message: "Post unliked successfully",
            success: true
        })
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({
            message: "Error unliking post",
            success: false,
            error: error
        });
    }
}
const createComment = async (req : Request | any , res : Response) => {
    try {
        const { id } = req.params
        const {
            text,
            userId,
        } = req.body
        const comment = await prisma.comment.create({
            data : {
                text,
                userId : req.userId ?? userId,
                postId : id,
            },
            include: {
                commentedBy: true, // Include the user who commented
            }
        })
        res.status(200).json({
            success : true,
            message : "Comment created succesfully",
            comment, // Send back the created comment with commentedBy info
        })
    }catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({
            success: false,
            message: "Error creating comment",
            error: error
        });
    }
}
const getCommentsByPost = async (req : Request | any , res : Response) => {
    const { id } = req.params
    try {
        const comments = await prisma.comment.findMany({
            where : { postId : id }
        })
        res.status(200).json({
            success : true,
            message : "Comments fetched successfully",
            comments
        })
    }catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching comments",
            error: error
        });
    }
}
const deleteComment = async (req : Request | any , res : Response) => {
    const { id } = req.params
    try {
        await prisma.comment.delete({
            where : { id }
        })
        res.status(200).json({
            success : true,
            message : "Comment deleted successfully",
        })
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting comment",
            error: error
        });
    }
}

posts.post("/create" , createPost)
posts.get("/all", getAllPosts )
posts.delete("/:id" , deletePost)
posts.put("/:id" , updatePost)
posts.get("/:id" , getPostsByCommunity)
posts.post("/:id/like" , likePost)
posts.post("/:id/unlike" , unlikePost)
posts.post("/:id/comment" , createComment)
posts.get("/:id/comments" , getCommentsByPost)
posts.delete("/:id/comment/:commentId" , deleteComment)

export default posts