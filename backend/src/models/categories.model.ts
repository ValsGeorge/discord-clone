import { Category } from '@/interfaces/categories.interface';
import { model, Schema, Document, Types } from 'mongoose';

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

const categoryModel = model<Category & Document>('Categories', categorySchema);

export default categoryModel;
