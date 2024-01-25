import { model, Schema, Document, Types } from 'mongoose';
import { Channel } from '../interfaces/channels.interface';

const channelSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    description: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    server: {
        type: Types.ObjectId,
        ref: 'Servers',
        required: true,
    },
    category: {
        type: Types.ObjectId,
        ref: 'Categories',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

channelSchema.index(
    { name: 1, type: 1, category: 1, server: 1 },
    { unique: true }
);

channelSchema.virtual('id').get(function (this: Document) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
channelSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
        delete ret._id;
    },
});

const channelModel = model<Channel & Document>('Channels', channelSchema);

export default channelModel;
