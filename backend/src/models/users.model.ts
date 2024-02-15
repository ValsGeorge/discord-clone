import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';
import userServerModel from './userServer.model';

const userSchema: Schema = new Schema({
    nickname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '/default-profile-picture.jpg',
    },
});

userSchema.virtual('id').get(function (this: Document) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
        delete ret._id;
    },
});

userSchema.pre<User & Document>('remove', async function (next) {
    try {
        // Delete entries in userServerModel, categoryModel
        await userServerModel.deleteMany({ user: this._id });

        next();
    } catch (error) {
        next(error);
    }
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
