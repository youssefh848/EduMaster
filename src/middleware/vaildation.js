// import modules
import joi from 'joi';
import { AppError } from '../utils/appError.js';

export const generalFields = {
    name: joi.string(),
    email: joi.string().email(),
    password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cPassword: joi.string().valid(joi.ref('password')),
    mobileNumber: joi.string().pattern(new RegExp(/^01[0-2,5]{1}[0-9]{8}$/)),
    DOB: joi.string()
        .regex(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)
        .message('Date of birth must be in format YYYY-M-D or YYYY-MM-DD'),
    objectId: joi.string().hex().length(24),
    otp: joi.string().length(6),
    title: joi.string(),
    description: joi.string().min(10).max(1000),
    video: joi.string().pattern(new RegExp(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)),
}

export const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.params, ...req.query }
        const { error } = schema.validate(data, { abortEarly: false })
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(errorMessage, 400));
        }
        next()
    }
}