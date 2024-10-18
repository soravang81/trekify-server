import express from "express";
import api from "./routes/api";
import auth from "./routes/auth";
import cors from "cors"
import buddyRouter from './routes/api/buddy';
import gemini from "./routes/gemini";

const app = express()
const port = 8080

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",  // Replace with your frontend URL
  credentials: true
}))

app.use("/api", api)
app.use("/auth", auth)
app.use("/gemini", gemini)
app.use('/api/buddy', buddyRouter);


app.listen(port, () => console.log('Server is running on port ' + port))

