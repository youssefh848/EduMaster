import { model, Schema, Types } from "mongoose";
import { highSchool } from "../../src/utils/constant/enums.js";

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
    classLevel: {
        type: String,
        required: true,
        enum: Object.values(highSchool),
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })


// model 
export const Lesson = model('Lesson', lessonSchema);