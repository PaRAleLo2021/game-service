import {Document} from 'mongoose';

export default interface IGame extends Document{
    username: string;
    password: string;
    email: string;
    extraInformation: string;
}