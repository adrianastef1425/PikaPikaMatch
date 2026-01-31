package com.pikapikamatch.exception;

/**
 * Exception thrown when request validation fails.
 * This exception indicates that the provided data does not meet validation requirements.
 */
public class ValidationException extends RuntimeException {
    
    public ValidationException(String message) {
        super(message);
    }
    
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
