class ApiError extends Error {
    code;
    constructor(message, errorCode) {
        super(message);
        this.code = errorCode;
        this.name = 'ApiError';
    }
}
export default ApiError;
