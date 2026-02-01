package com.pikapikamatch.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating vote counts (likes or dislikes) for a character.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateVoteCountDTO {
    
    /**
     * The amount to add to the vote counter.
     * Must be a positive integer (minimum 1).
     */
    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be at least 1")
    private Integer amount;
}
