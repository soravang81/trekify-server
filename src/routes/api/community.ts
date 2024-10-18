import express, { Request } from "express"
import prisma from "../../db/db";
import posts from "./posts";

const community = express.Router();

community.use("/post",posts)

community.get("/all" , async (req : Request | any, res) => {
    try {
        const communities = await prisma.community.findMany({
            include : {
                members : true
            }
        })
        res.json({
            success : true,
            communities
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ success: false, error: "An error occurred while fetching communities" });
    }
})

community.post("/my" , async (req : Request | any, res) => {
    try {
        const { id } = req.body
        const communities = await prisma.user.findUnique({
            where : {
                id
            },
            select : {
                joinedCommunities : {
                    select : {
                        community : {
                            include : {
                                members : true
                            }
                        },
                    }
                },
            }
        })
        const mycommunities = communities?.joinedCommunities.map(com =>  com.community)
        res.json({
            success : true,
            communities : mycommunities
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ success: false, error: "An error occurred while fetching communities" });
    }
})

community.get("/:id" , async (req : Request | any, res) => {
    try {
        const community = await prisma.community.findFirst({
            where : {
                id : req.params.id,
                members : {
                    none : {
                        userId : req.userId ?? req.params.id
                    }
                }
            },
            include : {
                members : true
            }
        })
        res.json({
            success : true,
            community
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: "An error occurred while fetching communities" });
    }
})

community.post("/create" , async (req : Request | any , res ) => {
    try {
        const {
            name , 
            image,
            description , 
            tags,
            userId
        }:{ 
            name:string,
            image : string,
            description:string,
            tags:string[],
            userId : string
        } = req.body
        await prisma.community.create({
            data: {
                name , description , image, tags , admin :{
                    create : {
                        userId : req.userId ?? userId
                    },
                }, members : {
                    create : {
                        userId : req.userId ?? userId
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
community.post("/join", async (req: Request | any, res) => {
    try {
        const {
            communityId,
            userId
        }: {
            communityId: string,
            userId: string
        } = req.body

        console.log(req.body)

        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: req.userId ?? userId }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the community exists
        const community = await prisma.community.findUnique({
            where: { id: communityId }
        });

        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        // Check if the user is already a member
        const existingMember = await prisma.communityMember.findFirst({
            where: {
                userId: req.userId ?? userId,
                communityId: communityId
            }
        });

        if (existingMember) {
            return res.status(400).json({ error: "User is already a member of this community" });
        }

        // If all checks pass, add the user to the community
        await prisma.communityMember.create({
            data: {
                userId: req.userId ?? userId,
                communityId: communityId
            }
        });

        res.status(200).json({ success: true, message: "Successfully joined the community" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "An error occurred while joining the community" + e});
        console.log(e)
    }
});
export default community