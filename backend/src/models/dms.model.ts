import { model, Schema, Document } from 'mongoose';
import { User } from '../interfaces/users.interface';
import { Dm } from '../interfaces/dms.interface';

const dmsSchema: Schema = new Schema({
    content: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
});

dmsSchema.virtual('id').get(function (this: Document) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
dmsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
        delete ret._id;
    },
});

const dmsModel = model<Dm & Document>('Dms', dmsSchema);

export default dmsModel;
