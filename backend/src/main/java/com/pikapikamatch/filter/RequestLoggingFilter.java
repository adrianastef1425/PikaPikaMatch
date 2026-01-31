package com.pikapikamatch.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

/**
 * Filter that logs HTTP request and response information.
 * Logs method, path, status code, and duration for each request.
 */
@Component
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        long startTime = System.currentTimeMillis();
        
        String method = request.getMethod();
        String path = request.getRequestURI();
        String queryString = request.getQueryString();
        
        // Build full path with query string if present
        String fullPath = queryString != null ? path + "?" + queryString : path;
        
        log.info("Incoming request: {} {}", method, fullPath);
        
        try {
            // Continue with the filter chain
            filterChain.doFilter(request, response);
        } finally {
            // Calculate duration
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();
            
            // Log response information
            if (status >= 500) {
                log.error("Completed request: {} {} - Status: {} - Duration: {}ms", 
                    method, fullPath, status, duration);
            } else if (status >= 400) {
                log.warn("Completed request: {} {} - Status: {} - Duration: {}ms", 
                    method, fullPath, status, duration);
            } else {
                log.info("Completed request: {} {} - Status: {} - Duration: {}ms", 
                    method, fullPath, status, duration);
            }
        }
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Don't log actuator endpoints or static resources
        String path = request.getRequestURI();
        return path.startsWith("/actuator") || 
               path.startsWith("/swagger-ui") || 
               path.startsWith("/api-docs") ||
               path.startsWith("/v3/api-docs");
    }
}
