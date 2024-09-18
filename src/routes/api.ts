import express from "express"
import cors from "cors"
import user from "./api/user";
import {verifyAuth} from "../middleware/authmiddleware"

const api = express.Router();
api.use(express.json())

api.use("/user",verifyAuth, user)

api.post("/"  , async (req, res) => {
    console.log(req.body.id)
    res.send("hello")
    try {
    } catch (e) {
        console.error(e)
    }
})
export default api
