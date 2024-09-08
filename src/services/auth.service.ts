// import {ApiError} from "../exceptions/api.error";
// import {usersRepository} from "../repositories/usersRepository";
// import {authRepository} from "../repositories/authRepository";
// import {LoginUserDto} from "../dtos/login.dto";
// import {tokenService} from "./token.service";
// import {tokensRepository} from "../repositories/tokensRepository";
// import {RTokenDB} from "../types/tokens.interface";
// import {usersQueryRepository} from "../queryRepositories/usersQueryRepository";
// import {v4 as uuid} from "uuid";
// import mailService from "./mail.service";
// import {userService} from "./user.service";
// import {cryptoService} from "./crypto.service";
// import {deviceCollection, tokenCollection} from "../db/mongo-db";
//
//
// export const authService = {
//
//     async loginUser(userData: LoginUserDto, deviceId: string) {
//         const user = await this.validateUser(userData.loginOrEmail)
//         if (!user) {
//             throw ApiError.UnauthorizedError()
//         }
//         const isPasswordCorrect = await cryptoService.comparePassword(userData.password, user.password)
//         if (!isPasswordCorrect) {
//             throw ApiError.UnauthorizedError()
//         }
//         const {accessToken, refreshToken} = tokenService.createTokens(user._id.toString(), deviceId)
//         return {
//             accessToken,
//             refreshToken
//         }
//     },
//
//     async refreshToken(token: string) {
//         const tokenValidate: any = tokenService.validateRefreshToken(token)
//         if (!tokenValidate) {
//             throw ApiError.UnauthorizedError()
//         }
//         const isTokenExists = await tokensRepository.findTokenByRefreshToken(token)
//         if (!isTokenExists || isTokenExists.blackList) {
//             throw ApiError.UnauthorizedError()
//         }
//         const updateTokenInfo = await tokensRepository.updateTokenForActivate(token)
//         if (!updateTokenInfo) {
//             throw ApiError.UnauthorizedError()
//         }
//         const {refreshToken, accessToken} = tokenService.createTokens(isTokenExists.userId, tokenValidate.deviceId)
//         const tokenData = {
//             userId: isTokenExists.userId,
//             deviceId: isTokenExists.deviceId,
//             refreshToken,
//             blackList: false
//         } as RTokenDB
//         const addTokenToDb = await tokensRepository.createToken(tokenData)
//         if (!addTokenToDb) {
//             throw ApiError.UnauthorizedError()
//         }
//         return {
//             refreshToken,
//             accessToken
//         }
//
//     },
//
//     async getMe(token: string) {
//         const tokenData: any = tokenService.decodeToken(token)
//         const user = await usersQueryRepository.userOutput(tokenData._id)
//         if (!user) {
//             throw ApiError.UnauthorizedError()
//         }
//         return user
//     },
//
//     async logoutUser(token: string) {
//         const tokenValidate: any = tokenService.validateRefreshToken(token)
//         if (!tokenValidate) {
//             throw ApiError.UnauthorizedError()
//         }
//         const isTokenExists = await tokensRepository.findTokenByRefreshToken(token)
//         if (!isTokenExists || isTokenExists.blackList) {
//             throw ApiError.UnauthorizedError()
//         }
//         const updatedToken = await tokenCollection.updateMany({deviceId: tokenValidate.deviceId}, {$set: {blackList: true}})
//         if (!updatedToken) {
//             throw ApiError.UnauthorizedError()
//         }
//         const updateDevices = await deviceCollection.deleteOne({deviceId: tokenValidate.deviceId})
//         if (!updateDevices) {
//             throw ApiError.UnauthorizedError()
//         }
//         return updatedToken
//     },
//
//     async activateEmail(confirmationCode: string) {
//         const isActivateEmail = await authRepository.checkActivateEmailByCode(confirmationCode)
//         if (!isActivateEmail) {
//             throw ApiError.BadRequest('Юзер уже активирован', 'code')
//         }
//         const updateEmailStatus = await authRepository.toActivateEmail(confirmationCode)
//         if (!updateEmailStatus) {
//             throw ApiError.BadRequest('Юзер не найден', 'code')
//         }
//         return updateEmailStatus
//     },
//
//     async resendEmail(email: string) {
//         await this.isActivateEmailByStatus(email)
//         const activationLink = uuid()
//         const emailConfirmation = userService.createEmailConfirmationInfo(false, activationLink)
//         await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/registration-confirmation/?code=${activationLink}`)
//         const updateUserInfo = await authRepository.updateUserWithResendActivateEmail(email, emailConfirmation)
//         if (!updateUserInfo) {
//             throw ApiError.UnauthorizedError()
//         }
//         return updateUserInfo
//     },
//
//     async isActivateEmailByStatus(email: string) {
//         const isActivateEmail = await usersRepository.getUserByEmail(email)
//         if (!isActivateEmail) {
//             throw ApiError.BadRequest('Юзер не найден', 'email')
//         }
//         if (isActivateEmail.emailConfirmation.isConfirmed) {
//             throw ApiError.BadRequest('Юзер уже активирован', 'email')
//         }
//         return isActivateEmail
//     }
//
// }

import {ApiError} from "../exceptions/api.error";
import {ILogin} from "../types/ILogin";
import {userService} from "./user.service";
import {cryptoService} from "./crypto.service";
import {tokenService} from "./token.service";
import {usersRepository} from "../features/users/usersRepository";
import mailService from "./mail.service";
import {authRepository} from "../features/auth/authRepository";

class AuthService {

    async loginUser(userData: ILogin) {
        const user = await userService.validateUser(userData.loginOrEmail)
        if (!user) {
            throw ApiError.UnauthorizedError()
        }
        const isPasswordCorrect = await cryptoService.comparePassword(userData.password, user.password)
        if (!isPasswordCorrect) {
            throw ApiError.UnauthorizedError()
        }
        const {accessToken, refreshToken} = tokenService.createTokens(user._id)
        return {
            accessToken,
            refreshToken
        }
    }

    async getMe(token: string) {
        const tokenData: any = tokenService.decodeToken(token)
        const user = await usersRepository.findUserById(tokenData._id)
        if (!user) {
            throw ApiError.UnauthorizedError()
        }
        return user
    }

    async resendEmail(email: string) {
        await this.isActivateEmailByStatus(email)
        const emailConfirmation = userService.createEmailConfirmationInfo(false)
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/registration-confirmation/?code=${emailConfirmation.confirmationCode}`)
        const updateUserInfo = await authRepository.updateUserWithResendActivateEmail(email, emailConfirmation)
        if (!updateUserInfo) {
            throw ApiError.UnauthorizedError()
        }
        return updateUserInfo
    }

    async isActivateEmailByStatus(email: string) {
        const isActivateEmail: any = await usersRepository.getUserByEmail(email)
        if (!isActivateEmail) {
            throw ApiError.BadRequest('Юзер не найден', 'email')
        }
        if (isActivateEmail.emailConfirmation.isConfirmed) {
            throw ApiError.BadRequest('Юзер уже активирован', 'email')
        }
        return isActivateEmail
    }

    async activateEmail(confirmationCode: string) {
        const isActivateEmail = await authRepository.checkActivateEmailByCode(confirmationCode)
        if (!isActivateEmail) {
            throw ApiError.BadRequest('Юзер уже активирован', 'code')
        }
        const updateEmailStatus = await authRepository.toActivateEmail(confirmationCode)
        if (!updateEmailStatus) {
            throw ApiError.BadRequest('Юзер не найден', 'code')
        }
        return updateEmailStatus
    }

    async refreshToken(token: string) {
        const tokenValidate: any = tokenService.validateRefreshToken(token)
        if (!tokenValidate) {
            throw ApiError.UnauthorizedError()
        }
        const isTokenExists = await tokenService.findTokenInDb(token)
        if (!isTokenExists || isTokenExists.blackList) {
            throw ApiError.UnauthorizedError()
        }
        const updateTokenInfo = await tokenService.updateTokensStatus(token)
        if (!updateTokenInfo) {
            throw ApiError.UnauthorizedError()
        }
        const {refreshToken, accessToken} = tokenService.createTokens(isTokenExists.userId)
        const addTokenToDb = await tokenService.saveTokenInDb(isTokenExists.userId, refreshToken, false)
        if (!addTokenToDb) {
            throw ApiError.UnauthorizedError()
        }
        return {
            refreshToken,
            accessToken
        }

    }

    async logoutUser(token: string) {
        const tokenValidate: any = tokenService.validateRefreshToken(token)
        if (!tokenValidate) {
            throw ApiError.UnauthorizedError()
        }
        const isTokenExists = await tokenService.findTokenInDb(token)
        if (!isTokenExists || isTokenExists.blackList) {
            throw ApiError.UnauthorizedError()
        }
        const updatedToken = await tokenService.updateTokensStatus(token)
        // const updatedToken = await tokenCollection.updateMany({deviceId: tokenValidate.deviceId}, {$set: {blackList: true}})
        if (!updatedToken) {
            throw ApiError.UnauthorizedError()
        }
        // const updateDevices = await deviceCollection.deleteOne({deviceId: tokenValidate.deviceId})
        // if (!updateDevices) {
        //     throw ApiError.UnauthorizedError()
        // }
        return updatedToken
    }

}

export const authService = new AuthService();
