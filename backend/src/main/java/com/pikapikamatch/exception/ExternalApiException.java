package com.pikapikamatch.exception;

/**
 * Exception thrown when external API calls fail after all retry attempts.
 * This exception indicates that the external service is temporarily unavailable.
 */
public class ExternalApiException extends RuntimeException {
    
    public ExternalApiException(String message) {
        super(message);
    }
    
    public ExternalApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
