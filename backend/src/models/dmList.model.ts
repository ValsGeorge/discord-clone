import { model, Schema, Document } from 'mongoose';
import { DmList } from '../interfaces/dmList.interface';
import { User } from '../interfaces/users.interface';

const dmListSchema: Schema = new Schema({
    me: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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

dmListSchema.virtual('id').get(function (this: Document) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
dmListSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
        delete ret._id;
    },
});

const dmListModel = model<DmList & Document>('DMLists', dmListSchema);

export default dmListModel;
