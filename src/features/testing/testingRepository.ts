// import {
//     blogCollection,
//     commentCollection,
//     deviceCollection,
//     postCollection,
//     tokenCollection,
//     userCollection
// } from "../db/mongo-db";
//
//
// export const testingRepository = {
//     async deleteAll() {
//         const blogs = await blogCollection.deleteMany()
//         const posts = await postCollection.deleteMany()
//         const users = await userCollection.deleteMany()
//         const comments = await commentCollection.deleteMany()
//         const tokens = await tokenCollection.deleteMany()
//         const devices = await deviceCollection.deleteMany()
//         // const rates = await rateLimitCollection.deleteMany()
//         return {
//             blogs,
//             posts,
//             users,
//             comments,
//             tokens,
//             devices,
//             // rates
//         }
//     },
// }

import {blogModel} from "../../models/blogsModel";
import {postModel} from "../../models/postsModel";
import {userModel} from "../../models/usersModel";
import {commentModel} from "../../models/commentsModel";
import {tokenModel} from "../../models/tokensModel";
import {deviceModel} from "../../models/devicesModel";

class TestingRepository {

    async deleteAll() {
        const blogs = await blogModel.deleteMany()
        const posts = await postModel.deleteMany()
        const users = await userModel.deleteMany()
        const comments = await commentModel.deleteMany()
        const tokens = await tokenModel.deleteMany()
        const devices = await deviceModel.deleteMany()
        // const rates = await rateLimitCollection.deleteMany()
        return {
            blogs,
            posts,
            users,
            comments,
            tokens,
            devices,
            // rates
        }
    }
}

export const testingRepository = new TestingRepository();
