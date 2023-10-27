import express, { Router } from 'express';
import UserController from '../controllers/user';
import { loginResponse, newUserResponse } from '../utils/responses/user.responses';
import { successResponse } from '../utils/responses/success.responses';
import { payloadValidation } from '../middleware/payloadValidation';

const userRouter: Router = express.Router();

userRouter.route('/login')
    .post(payloadValidation, async (_req, res): Promise<any> => {
        const controller: UserController = new UserController();
        const user = { ..._req.body }
        const response: loginResponse = await controller.login(user);
        return res.send(successResponse(response));
    })

userRouter.route('/register')
    .post(payloadValidation, async (_req, res): Promise<any> => {
        const controller: UserController = new UserController();
        const user = { ..._req.body }
        const response: newUserResponse = await controller.register(user);
        return res.send(successResponse(response));
    })

export default userRouter;
