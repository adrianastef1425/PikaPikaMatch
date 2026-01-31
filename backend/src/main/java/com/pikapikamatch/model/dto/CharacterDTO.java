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
@Schema(description = "Character data transfer object")
public class CharacterDTO {
    
    @Schema(description = "Internal character ID", example = "pokemon-25")
    private String id;
    
    @Schema(description = "External API ID", example = "25")
    private String externalId;
    
    @Schema(description = "Character name", example = "Pikachu")
    private String name;
    
    @Schema(description = "Character source", example = "pokemon", allowableValues = {"pokemon", "rickandmorty", "superhero"})
    private String source;
    
    @Schema(description = "Character image URL", example = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png")
    private String imageUrl;
    
    @Schema(description = "Character description", example = "An Electric-type Pokemon")
    private String description;
}
