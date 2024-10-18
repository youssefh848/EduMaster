import { model, Schema, Types } from "mongoose";

// schema
const lessonSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: false  // todo true
    }
}, { timestamps: true })


// model 
export const Lesson = model('Lesson', lessonSchema);