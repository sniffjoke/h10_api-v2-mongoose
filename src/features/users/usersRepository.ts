// import {userCollection} from "../db/mongo-db";
// import {ObjectId, WithId} from "mongodb";
// import {UserDBType} from "../dtos/users.dto";
// import {User} from "../types/users.interface";
//
// export interface EmailConfirmationModel {
//         confirmationCode?: string
//         expirationDate?: string
//         isConfirmed: boolean
// }
//
// export const usersRepository = {
//
//     async createUser(userData: UserDBType, emailConfirmation: EmailConfirmationModel): Promise<ObjectId> {
//         const user: User = {
//             login: userData.login,
//             email: userData.email,
//             password: userData.password,
//             emailConfirmation,
//             createdAt: new Date(Date.now()).toISOString()
//         }
//         const newUser = await userCollection.insertOne(user as WithId<User>)
//         return newUser.insertedId
//     },
//
//     async deleteUser(id: string) {
//         return await userCollection.deleteOne({_id: new ObjectId(id)})
//     },
//
//     async findUserById(id: string) {
//         return await userCollection.findOne({_id: new ObjectId(id)})
//     },
//
//     async getUserByEmail(email: string) {
//         const user = await userCollection.findOne({email}) //$or
//         return user
//     },
//
//     async getUserByLogin(login: string) {
//         const user = await userCollection.findOne({login})
//         return user
//     },
//
// }

import {IUser} from "../../types/IUser";
import {CreateUserDto} from "./dto/CreateUser.dto";
import {userModel} from "../../models/usersModel";
import {userService} from "../../services/user.service";
import {UserInstance} from "../../interfaces/users.interface";

interface EmailConfirmationModel {
    confirmationCode?: string
    expirationDate?: string
    isConfirmed: boolean
}

class UsersRepository {

    public users = userModel

    async createUser(userData: IUser): Promise<CreateUserDto> {
        const emailConfirmation: EmailConfirmationModel = userService.createEmailConfirmationInfo(true)
        const user = new this.users({...userData, emailConfirmation})
        await user.save()
        const userDto = new CreateUserDto(user)
        return userDto
    }

    async findUserById(id: string): Promise<UserInstance | null> {
        const user = await this.users.findById(id)
        return user
    }

    async deleteUser(id: string) {
        const user = await this.users.findByIdAndDelete(id)
        return user
    }


}

export const usersRepository = new UsersRepository();
