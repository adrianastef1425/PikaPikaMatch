package com.pikapikamatch.service;

import com.pikapikamatch.exception.ExternalApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.util.function.Supplier;

/**
 * Service that provides retry logic with exponential backoff for external API calls.
 * Implements resilience patterns to handle temporary failures in external services.
 */
@Service
@Slf4j
public class RetryService {
    
    private static final int MAX_RETRIES = 3;
    private static final long INITIAL_BACKOFF = 1000; // 1 second
    
    /**
     * Executes an API call with retry logic and exponential backoff.
     * 
     * @param apiCall The API call to execute (as a Supplier)
     * @param apiName The name of the API for logging purposes
     * @param <T> The return type of the API call
     * @return The result of the successful API call
     * @throws ExternalApiException if all retry attempts fail
     */
    public <T> T executeWithRetry(Supplier<T> apiCall, String apiName) {
        int attempt = 0;
        Exception lastException = null;
        
        while (attempt < MAX_RETRIES) {
            try {
                log.debug("Attempting API call to {} (attempt {}/{})", apiName, attempt + 1, MAX_RETRIES);
                return apiCall.get();
            } catch (RestClientException e) {
                lastException = e;
                attempt++;
                
                if (attempt < MAX_RETRIES) {
                    long backoff = INITIAL_BACKOFF * (long) Math.pow(2, attempt - 1);
                    log.warn("API call to {} failed (attempt {}/{}). Retrying in {}ms. Error: {}",
                        apiName, attempt, MAX_RETRIES, backoff, e.getMessage());
                    
                    try {
                        Thread.sleep(backoff);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        log.error("Retry interrupted for {}", apiName, ie);
                        throw new ExternalApiException("Retry interrupted for " + apiName, ie);
                    }
                } else {
                    log.error("API call to {} failed after {} attempts. Error: {}", 
                        apiName, MAX_RETRIES, e.getMessage());
                }
            }
        }
        
        log.error("All {} retry attempts failed for {}", MAX_RETRIES, apiName);
        throw new ExternalApiException(
            String.format("Failed to call %s after %d attempts", apiName, MAX_RETRIES),
            lastException
        );
    }
}
