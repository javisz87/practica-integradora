export const ErrorDictionary = {
    PRODUCT_NOT_ADDED_TO_CART: 'Error al agregar el producto al carrito.',
    PRODUCT_NOT_CREATED: 'Error al crear el producto.',
    PRODUCT_NOT_MODIFIED: 'Error al modificar el producto.',
    PRODUCT_NOT_DELETED: 'Error al borrar el producto.',
    PRODUCT_NOT_FOUND: 'Error al buscar el producto.',
    CART_NOT_FOUND: 'Error al buscar el carrito.',
    USER_NOT_FOUND: 'Error al buscar el usuario.',
    ROUTING_ERROR: `ROUTING_ERROR`,
    INVALID_TYPES_ERROR: `INVALID_TYPES_ERROR`,
    CONTROLLER_ERROR: `CONTROLLER_ERROR`,
    SERVICE_ERROR: `SERVICE_ERROR`,
    DATABASE_ERROR: `DATABASE_ERROR`,
    INVALID_PARAMS_ERROR: `INVALID_PARAMS_ERROR`,
    INTERNAL_SERVER_ERROR: `INTERNAL_SERVER_ERROR`,
};

export class HttpResponse {

    static OK(res, message, data) {
        return res.status(200).json({
            status: 200,
            statusMessage: message,
            data,
        });
    }

    static BadRequest(res, errorKey) {
        const errorMessage = ErrorDictionary[errorKey] || 'Bad request error.';
        return res.status(400).json({
            status: 400,
            statusMessage: errorMessage,
        });
    }

    static NotFound(res, errorKey) {
        const errorMessage = ErrorDictionary[errorKey] || 'Not found error.';
        return res.status(404).json({
            status: 404,
            statusMessage: errorMessage,
        });
    }

    static InternalServerError(res, errorKey) {
        const errorMessage = ErrorDictionary[errorKey] || 'Internal server error.';
        return res.status(500).json({
            status: 500,
            statusMessage: errorMessage,
        });
    }

    static Unauthorized(res, errorKey, data) {
        const errorMessage = ErrorDictionary[errorKey] || 'Unauthorized error.';
        return res.status(401).json({
            status: 401,
            statusMessage: errorMessage,
            data,
        });
    }

    static Forbidden(res, errorKey, data) {
        const errorMessage = ErrorDictionary[errorKey] || 'Forbidden error';
        return res.status(403).json({
            status: 403,
            statusMessage: errorMessage,
            data,
        });
    }
}
