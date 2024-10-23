import bcrypt from 'bcrypt'
import { messages } from "../../utils/constant/messages.js";
import { User } from '../../../db/index.js';
import { roles } from '../../utils/constant/enums.js';
import { AppError } from '../../utils/appError.js';

// create admin 
export const createAdmin = async (req, res, next) => {
    // get data from req
    const { fullName, email, password, phoneNumber } = req.body;
    // check email existance or phone 
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
        return next(new AppError(messages.user.alreadyExist, 400));
    }
    // hash password
    const hashedPassword = bcrypt.hashSync(password, 8)
    // create admin
    const admin = new User({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        role: roles.ADMIN,
        isVerified: true
    })
    // add to db 
    const adminCreated = await admin.save()
    // handel fail
    if (!adminCreated) {
        return next(new AppError(messages.user.failToCreate, 500));
    }
    // send res
    res.status(201).json({
        message: messages.user.created,
        success: true,
        data: adminCreated
    })
}