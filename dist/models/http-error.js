class ApiError extends Error {
    code;
    constructor(message, errorCode) {
        super(message);
        this.code = errorCode;
    }
}
export default ApiError;
