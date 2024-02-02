import { model, Schema, Document } from 'mongoose';
import { User } from '@/interfaces/users.interface';
import { FriendRequest } from '@/interfaces/friendRequests.interface';

const friendRequestSchema: Schema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

friendRequestSchema.virtual('id').get(function (this: Document) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
friendRequestSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
        delete ret._id;
    },
});

const friendRequestModel = model<FriendRequest & Document>(
    'FriendRequest',
    friendRequestSchema
);

export default friendRequestModel;
