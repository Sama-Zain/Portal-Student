export const successResponse = (
    {res,
    statusCode = 200, 
    message = "Succes", 
    data = undefined}
    ) => {
    return res.status(statusCode).json({message, data })
}