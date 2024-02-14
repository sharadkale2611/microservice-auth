export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req,res, next)).catch((error)=>next(error))
    }
}



// ### Insted of using try catch, we can use above Promise syntax ###

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }