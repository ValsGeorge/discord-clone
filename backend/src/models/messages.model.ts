import { model, Document, Schema, Types } from 'mongoose';
import { Message } from '../interfaces/messages.interface';

const messageSchema: Schema = new Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    channel: {
        type: Types.ObjectId,
        ref: 'Channels',
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

messageSchema.virtual('id').get(function (this: Document) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
messageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
        delete ret._id;
    },
});

const messageModel = model<Message & Document>('Messages', messageSchema);

export default messageModel;
