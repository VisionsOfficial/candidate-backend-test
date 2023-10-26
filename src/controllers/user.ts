import { Body, Post, Route, Tags } from 'tsoa';
import logger from '../logger';
import { IUserCreate, User } from '../models/users';
import { loginResponse, newUserResponse } from '../responses/user.responses';
import { createHmac } from 'crypto';
import {sign} from 'jsonwebtoken';

const hashPwd = (salt: string, pw: string) => {
    const hmac = createHmac('sha256', salt);
    return hmac.update(pw).digest('hex');
};

@Route('/')
@Tags('Auth')
export default class UserController {
    @Post('/register')
    public async register(@Body() user: IUserCreate): Promise<newUserResponse> {
        try {
            // windows and env issue
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
            // windows and env issue
            const salt = process.env.SALT || "bL0YfttMWSTbIxxcwXw6CEnzWBnh7T1Nga7xtIwFsVkSSw87RTYzd/rgHssnA61EZNb9s4ZE+0wL+HmkGqEp0ynmSzv08zGUA0kSw/proimLRDCnD5+uOEWFWn0vV4Afg9sIrQMJ40ePqha85k9AzdQaO95rufgaDYp1kJwYTis=";

            user.password = hashPwd(salt, user.password);
            const foundUser = await User.findOne({ email: user.email, password: user.password });
            // windows and env issue
            const token = sign({ _id: foundUser?._id?.toString(), email: foundUser?.email }, process.env.SECRET || "visions", {
                expiresIn: '2 days',
            });

            return {
                data: {
                    email: foundUser?.email,
                    token: token,
                },
            };

        } catch(err){
            logger.error(err);
            throw err;
        }
    }

}

