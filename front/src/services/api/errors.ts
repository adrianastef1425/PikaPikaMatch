export class ApiError extends Error {
  statusCode: number;
  isRetryable: boolean;
  
  constructor(
    message: string,
    statusCode: number,
    isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
  }
}

export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message, 0, true);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, false);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404, false);
    this.name = 'NotFoundError';
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(message: string) {
    super(message, 503, true);
    this.name = 'ServiceUnavailableError';
  }
}
