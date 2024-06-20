import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();

app.use(cors({
    origin:  process.env.PRODUCTION_CORS_ORIGIN,
    // origin: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_CORS_ORIGIN : process.env.LOCAL_CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public"))

app.use(cookieParser())

// routes import 
import userRouter from './src/routes/user.routes.js'
import listRouter from './src/routes/list.routes.js'
import taskRouter from './src/routes/task.routes.js'

app.get('/',(req,res)=>{
    res.json('hello')
})

// routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/lists",listRouter)
app.use("/api/v1/tasks",taskRouter)

export {app}
