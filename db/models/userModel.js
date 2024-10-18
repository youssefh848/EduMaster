import { model, Schema } from "mongoose";

// schema
const userSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    classLevel: {
      type: String,
      required: true,
      enum: Object.values(classLevels), 
      default: classLevels.GRADE_1
  },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    cpassword: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Model
export const User = model('User', userSchema);
