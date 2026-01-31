package com.pikapikamatch.exception;

/**
 * Exception thrown when a requested resource is not found in the database.
 * This exception indicates that the requested data does not exist.
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
