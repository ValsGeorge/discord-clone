import { Category } from '@/interfaces/categories.interface';
import { model, Schema, Document, Types } from 'mongoose';
import channelModel from './channels.model';

const categorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    server: {
        type: Types.ObjectId,
        ref: 'Servers',
        required: true,
    },
    channels: [
        {
            type: Types.ObjectId,
            ref: 'Channels',
            required: false,
        },
    ],
    order: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
});

categorySchema.virtual('id').get(function (this: Document) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
        delete ret._id;
    },
});

categorySchema.pre<Category & Document>('remove', async function (next) {
    try {
        // Delete entries in channelModel
        // Call the remove method for each channel
        const channels = await channelModel.find({ category: this._id });
        channels.forEach(async (channel) => {
            await channel.remove();
        });

        next();
    } catch (error) {
        next(error);
    }
});

const categoryModel = model<Category & Document>('Categories', categorySchema);

export default categoryModel;
