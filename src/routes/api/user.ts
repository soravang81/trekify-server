import express, { Request } from "express"
import prisma from "../../db/db";

const user = express.Router();

user.get("/" , async (req : Request , res) => {
    const id = req.params.id
    try {
        await prisma.user.findFirst({
            where: {
                id
            }
        })
    } catch (e) {
        console.error(e)
    }
})
export default user