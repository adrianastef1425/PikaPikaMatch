package com.pikapikamatch.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Schema(description = "Generic API response wrapper")
public class Response<T> {
    
    @Schema(description = "Success status", example = "true")
    private boolean success;
    
    @Schema(description = "Response message", example = "Success")
    private String message;
    
    @Schema(description = "Response data")
    private T data;
    
    @Schema(description = "Response timestamp", example = "2024-01-31T10:30:00")
    private LocalDateTime timestamp;
    
    public static <T> Response<T> success(T data) {
        return new Response<>(true, "Success", data, LocalDateTime.now());
    }
    
    public static <T> Response<T> success(String message, T data) {
        return new Response<>(true, message, data, LocalDateTime.now());
    }
    
    public static <T> Response<T> error(String message) {
        return new Response<>(false, message, null, LocalDateTime.now());
    }
}
