package com.pikapikamatch.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Vote request data")
public class VoteRequestDTO {
    
    @NotBlank(message = "Character ID is required")
    @Schema(description = "Character ID", example = "pokemon-25", required = true)
    private String characterId;
    
    @NotBlank(message = "Character name is required")
    @Schema(description = "Character name", example = "Pikachu", required = true)
    private String characterName;
    
    @NotBlank(message = "Character source is required")
    @Pattern(regexp = "pokemon|rickandmorty|superhero", message = "Invalid source")
    @Schema(description = "Character source", example = "pokemon", allowableValues = {"pokemon", "rickandmorty", "superhero"}, required = true)
    private String characterSource;
    
    @NotBlank(message = "Vote type is required")
    @Pattern(regexp = "like|dislike", message = "Vote type must be 'like' or 'dislike'")
    @Schema(description = "Vote type", example = "like", allowableValues = {"like", "dislike"}, required = true)
    private String voteType;
    
    @NotBlank(message = "Image URL is required")
    @Schema(description = "Character image URL", example = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", required = true)
    private String imageUrl;
    
    @Schema(description = "Character description", example = "An Electric-type Pokemon")
    private String description;
}
