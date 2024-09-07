// import express from "express";
// import {
//     deleteCommentController,
//     getCommentByIdController,
//     getCommentsController,
//     updateCommentController
// } from "../controllers/commentsController";
// import {errorMiddleware} from "../middlewares/errors/errorMiddleware";
// import {contentCommentValidator, idCommentValidator} from "../middlewares/express-validators/commentsValidators";
// import {authMiddlewareWithBearer} from "../middlewares/auth/authMiddlewareWithBearer"
// import {isOwnMiddleware} from "../middlewares/isOwnMiddleware";
//
//
// const router = express.Router();
//
// router.route('/')
//     .get(getCommentsController)
//
//
// router.route('/:id')
//     .put(
//         authMiddlewareWithBearer,
//         idCommentValidator,
//         contentCommentValidator,
//         errorMiddleware,
//         isOwnMiddleware,
//         updateCommentController
//     )
//     .delete(
//         authMiddlewareWithBearer,
//         idCommentValidator,
//         errorMiddleware,
//         isOwnMiddleware,
//         deleteCommentController
//     )
//     .get(
//         idCommentValidator,
//         errorMiddleware,
//         getCommentByIdController
//     );
//
//
// export default router

import { Router } from "express";
import {commentsController} from "./commentsController";

const router = Router();

router.route('/')
    .get(
        commentsController.getCommentsWithParams
    )

router.route('/:id')
    .get(
        commentsController.getCommentById,
    )
    .put(
        commentsController.updateCommentById
    )
    .delete(
        commentsController.deleteCommentById
    )

export default router
