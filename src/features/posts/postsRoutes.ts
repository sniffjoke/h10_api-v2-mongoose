// import express from "express";
// import {
//     getPostsController,
//     createPostController,
//     updatePostController, getPostByIdController, deletePostController
// } from "../controllers/postsController";
// import {
//     titlePostValidator,
//     contentPostValidator,
//     shortDescriptionPostValidator,
//     blogIdValidator,
//     idPostValidator
// } from "../middlewares/express-validators/postsValidators";
// import {errorMiddleware} from "../middlewares/errors/errorMiddleware";
// import {authMiddlewareWithBasic} from "../middlewares/auth/authMiddlewareWithBasic";
// import {authMiddlewareWithBearer} from "../middlewares/auth/authMiddlewareWithBearer"
// import {createCommentByPostIdWithParamsController, getAllCommentsByPostIdController} from "../controllers/commentsController";
// import {contentCommentValidator} from "../middlewares/express-validators/commentsValidators";
//
//
// const router = express.Router();
//
// router.route('/')
//     .get(getPostsController)
//     .post(
//         authMiddlewareWithBasic,
//         titlePostValidator,
//         contentPostValidator,
//         blogIdValidator,
//         shortDescriptionPostValidator,
//         errorMiddleware,
//         createPostController
//     );
//
// router.route('/:id')
//     .put(
//         authMiddlewareWithBasic,
//         idPostValidator,
//         titlePostValidator,
//         contentPostValidator,
//         blogIdValidator,
//         shortDescriptionPostValidator,
//         errorMiddleware,
//         updatePostController
//     )
//     .delete(
//         authMiddlewareWithBasic,
//         idPostValidator,
//         errorMiddleware,
//         deletePostController
//     )
//     .get(
//         idPostValidator,
//         errorMiddleware,
//         getPostByIdController
//     )
//
//
// router.route('/:id/comments')
//     .get(
//         idPostValidator,
//         errorMiddleware,
//         getAllCommentsByPostIdController
//     )
//     .post(
//         authMiddlewareWithBearer,
//         idPostValidator,
//         contentCommentValidator,
//         errorMiddleware,
//         createCommentByPostIdWithParamsController
//     )
//
//
// export default router

import {Router} from 'express';
import {postsController} from "./postsController";
import {commentsController} from "../comments/commentsController";

const router = Router();

router.route("/")
    .get(
        postsController.getPostsWithParams
    )
    .post(
        postsController.createPost
    )

router.route("/:id")
    .get(
        postsController.getPostById
    )
    .put(
        postsController.updatePostById
    )
    .delete(
        postsController.deletePostById
    )

router.route('/:id/comments')
    .get(
        commentsController.getAllCommentsByPostId
    )
    .post(
        commentsController.createCommentByPostId
    )

export default router
