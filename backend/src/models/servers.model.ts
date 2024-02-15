import { model, Schema, Document, Types } from 'mongoose';
import { Server } from '../interfaces/servers.interface';
import userServerModel from './userServer.model';
import categoryModel from './categories.model';

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

serverSchema.pre<Server & Document>('remove', async function (next) {
    try {
        // Delete entries in userServerModel, categoryModel
        await userServerModel.deleteMany({ server: this._id });

        // Call the remove method for each category
        const categories = await categoryModel.find({ server: this._id });
        categories.forEach(async (category) => {
            await category.remove();
        });

        next();
    } catch (error) {
        next(error);
    }
});

const serverModel = model<Server & Document>('Server', serverSchema);

export default serverModel;
