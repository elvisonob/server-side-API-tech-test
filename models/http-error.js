class ApiError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
}

export default ApiError;
