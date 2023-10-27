import { IUser, IUserLogin } from '../../models/users';

interface newUserResponse {
    data: IUser;
}

interface loginResponse{
    data: IUserLogin;
}

export {
    newUserResponse,
    loginResponse,
}