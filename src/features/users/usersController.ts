import {NextFunction, Request, Response} from "express";
import {usersRepository} from "./usersRepository";
import {findUsersHelper} from "../../helpers/usersHelper";
import {usersQueryRepository} from "./usersQueryRepository";
import {CreateItemsWithQueryDto} from "../blogs/dto/CreateDataWithQuery.dto";
import {UserInstance} from "../../interfaces/users.interface";

class UsersController {

    async createUser(req: Request<any, any, any, any>, res: Response, next: NextFunction) {
        try {
            const newUser = await usersRepository.createUser(req.body)
            res.status(201).json(newUser)
        } catch (e) {
            next(e)
        }
    }

    public getUsersWithParams = async (req: Request<any, any, any, any>, res: Response) => {
        try {
            const usersQuery = await findUsersHelper(req.query)
            const sortedUsers = await usersQueryRepository.getAllUsersWithQuery(usersQuery)
            const usersQueryData = new CreateItemsWithQueryDto<UserInstance>(usersQuery, sortedUsers)
            res.status(200).json(usersQueryData)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async deleteUserById(req: Request, res: Response) {
        try {
            await usersRepository.deleteUser(req.params.id)
            res.status(204).send('Удалено');
        } catch (e) {
            res.status(500).send(e)
        }
    }

}

export const usersController = new UsersController();
