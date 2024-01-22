import { model, Schema, Document, Types } from 'mongoose';
import { Server } from '../interfaces/server.interface';

const serverSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    inviteCode: {
        type: String,
        unique: true,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    owner: {
        type: Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    members: [
        {
            type: Types.ObjectId,
            ref: 'Users',
            required: true,
        },
    ],
});
serverSchema.virtual('id').get(function (this: Document) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
serverSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
        delete ret._id;
    },
});

const serverModel = model<Server & Document>('Servers', serverSchema);

export default serverModel;
