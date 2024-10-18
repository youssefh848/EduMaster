import { lessonRouter } from "./modules/index.js";
import { globalErrorHandling } from "./utils/appError.js";


export const bootStrap = (app, express) => {
    // parse req
    app.use(express.json());
    // routing 
    app.use('/lesson', lessonRouter)
    // global error 
    app.use(globalErrorHandling)
}