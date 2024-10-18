import { Request, Response, Router } from "express";
import prisma from "../../db/db";

const guides = Router()

const createGuideProfile = async (req : Request | any , res : Response) => {
    try {
        const {userId ,name ,adharNo ,
            pincode ,address ,languages ,experience ,
            certifications ,bookings ,user
        } = req.body
        await prisma.guideDetails.create({
            data : {
                userId ,name ,adharNo ,
                pincode ,address ,languages ,experience ,
                certifications ,bookings ,user
            }
        })
        res.status(200).json({
            message : "Guide profile created successfully",
            success : true,
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message : "Error creating guide profile",
            success : false,
            error : e
        })
    }
}
const getGuideProfile = async (req : Request | any , res : Response) => {
    try {
        const {userId} = req.params
        const guide = await prisma.guideDetails.findUnique({
            where : {
                userId
            }
        })
        res.status(200).json({
            message : "Guide profile fetched successfully",
            success : true,
            guide
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message : "Error fetching guide profile",
            success : false,
            error : e
        })
    }
}

const updateGuideProfile = async (req: Request | any, res: Response) => {
    try {
        const { userId } = req.params;
        const updateData: any = {};
        
        const possibleFields = ['name', 'adharNo', 'pincode', 'address', 'languages', 'experience', 'certifications', 'bookings', 'user'];
        possibleFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        await prisma.guideDetails.update({
            where: { userId },
            data: updateData
        });

        res.status(200).json({
            message: "Guide profile updated successfully",
            success: true,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Error updating guide profile",
            success: false,
            error: e
        });
    }
}

const deleteGuideProfile = async (req : Request | any , res : Response) => {
    try {
        const {userId} = req.params
        await prisma.guideDetails.delete({
            where : {
                userId
            }
        })
        res.status(200).json({
            message : "Guide profile deleted successfully",
            success : true,
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message : "Error deleting guide profile",
            success : false,
            error : e
        })
    }
}

guides.post("/create" , createGuideProfile)
guides.get("/:userId" , getGuideProfile)
guides.put("/:userId" , updateGuideProfile)
guides.delete("/:userId" , deleteGuideProfile)

export default guides