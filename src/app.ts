import express from "express";
import cors from "cors";
import {SETTINGS} from "./settings";
import {connectToDB} from "./db/db";
// import blogsRoutes from "./routes/blogsRoutes";

// import postsRoutes from "./routes/postsRoutes";
// import testingRoutes from "./routes/testingRoutes";
// import usersRoutes from "./routes/usersRoutes";
// import authRoutes from "./routes/authRoutes";
// import commentsRoutes from "./routes/commentsRoutes";
import cookieParser from "cookie-parser"
import blogsRoutes from "./features/blogs/blogsRoutes";
import postsRoutes from "./features/posts/postsRoutes";
import usersRoutes from "./features/users/usersRoutes";
import commentsRoutes from "./features/comments/commentsRoutes";
// import devicesRoutes from "./routes/devicesRoutes";
// import {errorCustomApiMiddleware} from "./middlewares/errors/errorApiMiddleware";

connectToDB()

export const app = express()
app.set('trust proxy', true);
app.use(express.json())
app.use(cookieParser())
app.use(cors())


app.get('/', (req, res) => {

    res.status(200).json({version: '1.0'})

})

app.use(SETTINGS.PATH.BLOGS, blogsRoutes)
// app.use(SETTINGS.PATH.BLOGS + '/posts', blogsRoutes)
app.use(SETTINGS.PATH.POSTS, postsRoutes)
app.use(SETTINGS.PATH.POSTS + '/comments', postsRoutes)
app.use(SETTINGS.PATH.COMMENTS, commentsRoutes)
app.use(SETTINGS.PATH.USERS, usersRoutes)
// app.use(SETTINGS.PATH.AUTH, authRoutes)
// app.use(SETTINGS.PATH.SECURITY + '/devices', devicesRoutes)
// app.use(SETTINGS.PATH.TESTING, testingRoutes)
// app.use(errorCustomApiMiddleware)
