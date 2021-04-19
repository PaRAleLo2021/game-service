import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/game';

const NAMESPACE = 'Sample Controller';

const createGame = (req: Request, res: Response, next: NextFunction) => {
    //to be modified
    let { username, password, email } = req.body;

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        password,
        email
    });

    return user
        .save()
        .then((result) => {
            return res.status(201).json({
                user: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getAllGames = (req: Request, res: Response, next: NextFunction) => {
    User.find()
    .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { createGame, getAllGames };