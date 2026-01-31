package com.pikapikamatch.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Character statistics data")
public class CharacterStatsDTO {
    
    @Schema(description = "Character ID", example = "507f1f77bcf86cd799439011")
    private String id;
    
    @Schema(description = "External API ID", example = "25")
    private String externalId;
    
    @Schema(description = "Character name", example = "Pikachu")
    private String name;
    
    @Schema(description = "Character source", example = "pokemon")
    private String source;
    
    @Schema(description = "Character image URL", example = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png")
    private String imageUrl;
    
    @Schema(description = "Character description", example = "An Electric-type Pokemon")
    private String description;
    
    @Schema(description = "Total likes count", example = "150")
    private Integer totalLikes;
    
    @Schema(description = "Total dislikes count", example = "50")
    private Integer totalDislikes;
    
    @Schema(description = "Total votes count", example = "200")
    private Integer totalVotes;
    
    @Schema(description = "Like percentage", example = "75.0")
    private Double likePercentage;
    
    @Schema(description = "Dislike percentage", example = "25.0")
    private Double dislikePercentage;
}
