import mongoose,{ Schema } from 'mongoose';
import logging from '../config/logging';
import IGame from '../interfaces/game';

const GameSchema: Schema = new Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        email: {type: String, required: true},
        extraInformation: {type: String}
    },
    {
        timestamps: true
    }
);

GameSchema.post<IGame>('save', function () {
    this.extraInformation = "This is some extra info that was put onto this entry after the save :))";
    logging.info('Mongo', 'Checkout the user we just saved: ', this);
})

export default mongoose.model<IGame>('Game', GameSchema);
