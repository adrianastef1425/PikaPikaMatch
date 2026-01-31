package com.pikapikamatch.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Vote response data")
public class VoteResponseDTO {
    
    @Schema(description = "Vote ID", example = "507f1f77bcf86cd799439011")
    private String voteId;
    
    @Schema(description = "Character ID", example = "pokemon-25")
    private String characterId;
    
    @Schema(description = "Character name", example = "Pikachu")
    private String characterName;
    
    @Schema(description = "Character source", example = "pokemon")
    private String characterSource;
    
    @Schema(description = "Character image URL", example = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png")
    private String imageUrl;
    
    @Schema(description = "Character description", example = "An Electric-type Pokemon")
    private String description;
    
    @Schema(description = "Vote type", example = "like", allowableValues = {"like", "dislike"})
    private String voteType;
    
    @Schema(description = "Vote timestamp", example = "2024-01-31T10:30:00")
    private LocalDateTime timestamp;
}
