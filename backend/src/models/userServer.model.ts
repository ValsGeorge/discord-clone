import { Document, model, Schema } from 'mongoose';
import { UserServer } from '@interfaces/userServer.interface';
import { User } from '@interfaces/users.interface';
import { Server } from '@interfaces/servers.interface';

const userServerSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    server: {
        type: Schema.Types.ObjectId,
        ref: 'Server',
        required: true,
    },
    role: {
        type: String,
        enum: ['owner', 'admin', 'member'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

userServerSchema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userServerSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
        delete ret._id;
    },
});

const userServerModel = model<UserServer & Document>(
    'UserServer',
    userServerSchema
);

export default userServerModel;
