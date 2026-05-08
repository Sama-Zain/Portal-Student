export const errorResponse = ({
    statusCode = 400,
    message = "Error",
    extra= undefined
})=>{
    const error = new Error(
        typeof message === "string" ? message : message.message || "Error"
    );
    error.statusCode = statusCode;
    error.extra = extra;
    throw error;
};

export const BadRequestException = (
    message = "BadRequestException",
    extra = undefined
) =>{
    return errorResponse({statusCode:400,message,extra})
};

export const ConflictException = (
    message = "ConflictException",
    extra = undefined
) =>{
    return errorResponse({statusCode:409,message,extra})
};

export const UnauthorizedException = (
    message = "UnauthorizedException",
    extra = undefined
) =>{
    return errorResponse({statusCode:401,message,extra})
};

export const NotFoundException = (
    message = "NotFoundException",
    extra = undefined
) =>{
    return errorResponse({statusCode:404,message,extra})
};

export const ForbiddenException = (
    message = "ForbiddenException",
    extra = undefined
) =>{
    return errorResponse({statusCode:403,message,extra})
};
export const globalErrorHandler = (error,req,res,next) =>{
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    const extra = error.extra;
    return res.status(statusCode)
   .json({message: error.message,stack: error.stack , statusCode, extra});
};

