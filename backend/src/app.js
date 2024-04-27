import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();

app.use(cors({
    origin: 'https://todo-list-e89i-ow6fyauek-whitesnakes-projects.vercel.app/',
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public"))

app.use(cookieParser())

// routes import 
import userRouter from './routes/user.routes.js'
import listRouter from './routes/list.routes.js'
import taskRouter from './routes/task.routes.js'

// routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/lists",listRouter)
app.use("/api/v1/tasks",taskRouter)

export {app}