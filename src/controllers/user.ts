import { Body, Delete, Example, Get, Post, Put, Queries, Path, Route, Tags } from 'tsoa';
import { getAllContractValidations } from '../validations/contracts.validations';
import logger from '../logger';
import { IUserCreate, User } from '../models/users';
import { loginResponse, newUserResponse } from '../responses/user.responses';
import { createHash, randomBytes, createHmac, BinaryLike, KeyObject } from 'crypto';

const hashPwd = (salt: string, pw: string) => {
    const hmac = createHmac('sha256', salt);
    return hmac.update(pw).digest('hex');
};

@Route('/')
@Tags('Auth')
export default class UserController {
    // @Example<IContractCreate>({
    //     dataProvider: "A",
    //     dataConsumer: "B",
    //     termsAndConditions: [],
    //     target: "https://company.com/dataset/1",
    // })
    @Post('/register')
    public async register(@Body() user: IUserCreate): Promise<newUserResponse> {
        try {
            const salt = process.env.SALT || "bL0YfttMWSTbIxxcwXw6CEnzWBnh7T1Nga7xtIwFsVkSSw87RTYzd/rgHssnA61EZNb9s4ZE+0wL+HmkGqEp0ynmSzv08zGUA0kSw/proimLRDCnD5+uOEWFWn0vV4Afg9sIrQMJ40ePqha85k9AzdQaO95rufgaDYp1kJwYTis=";

            user.password = hashPwd(salt, user.password);
            const newContract = await User.create(user);
            return {
                data: newContract,
            };
        } catch(err){
            logger.error(err);
            throw err;
        }
    }


    @Post("/login")
    public async login(@Body() user: IUserCreate): Promise<loginResponse> {
        try{
            const salt = process.env.SALT || "bL0YfttMWSTbIxxcwXw6CEnzWBnh7T1Nga7xtIwFsVkSSw87RTYzd/rgHssnA61EZNb9s4ZE+0wL+HmkGqEp0ynmSzv08zGUA0kSw/proimLRDCnD5+uOEWFWn0vV4Afg9sIrQMJ40ePqha85k9AzdQaO95rufgaDYp1kJwYTis=";

            user.password = hashPwd(salt, user.password);
            const foundUser = await User.findOne({ email: user.email, password: user.password });
            return {
                data: {
                    email: foundUser?.email,
                },
            };
        } catch(err){
            logger.error(err);
            throw err;
        }
    }

}

