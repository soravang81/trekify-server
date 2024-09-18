import express from "express";
import api from "./routes/api";
import session from "express-session";
import auth from "./routes/auth";
import cors from "cors"
const app = express()
const port = 8080

app.use(express.json())
app.use(cors({
    origin : "*"
}))

app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

app.use("/api",api)
app.use("/auth", auth)

app.listen(port, () => console.log('Server is running on port ' + port))

