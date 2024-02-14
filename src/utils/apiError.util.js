import validate from "./validator.util.js"

class ApiError extends Error{
 
    constructor(
        statusCode,
        message="Unidentified error",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }

}

function handleError(res, statusCode, message) {
  
  if (process.env.ERROR_RETURN_TYPE === 'res') {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
    });
  }

  if (process.env.ERROR_RETURN_TYPE === 'throw') {
    throw new ApiError(statusCode, message);
  }

  throw new ApiError(500, '\n\nERROR_RETURN_TYPE is not configured!\n\n');

}

function handleValidationError(req, res, schema) {

  const { hasError, errorMessage } = validate(schema, req)

  if(hasError == false) return true;

    if (process.env.ERROR_RETURN_TYPE === 'res') {
      return res.status(400).json({
        success: false,
        message: errorMessage,
        data: null,
      });
    }
  
    if (process.env.ERROR_RETURN_TYPE === 'throw') {
      throw new ApiError(400, errorMessage);
    }

    throw new ApiError(500, '\n\nERROR_RETURN_TYPE is not configured!\n\n');
  }


export {ApiError, handleError, handleValidationError}