import { Schema, model, Document } from 'mongoose';


interface IUser extends Document{
    _id: string;
    email: string;
    password: string;
}

interface IUserCreate{
    email: string;
    password: string;
}

interface IUserLogin{
    email?: string;
    token?: string;
}

const contractSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const User = model('User', contractSchema);
export  { User, IUser, IUserCreate, IUserLogin };