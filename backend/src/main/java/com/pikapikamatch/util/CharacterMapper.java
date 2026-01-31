package com.pikapikamatch.util;

import com.pikapikamatch.model.dto.CharacterDTO;
import com.pikapikamatch.model.dto.CharacterStatsDTO;
import com.pikapikamatch.model.entity.Character;

public class CharacterMapper {
    
    private static final String DEFAULT_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";
    private static final String DEFAULT_DESCRIPTION = "No description available";
    private static final String DEFAULT_NAME = "Unknown";
    
    /**
     * Applies default values to a CharacterDTO for any missing fields
     * 
     * @param character the CharacterDTO to apply defaults to
     * @return a new CharacterDTO with defaults applied
     */
    public static CharacterDTO withDefaults(CharacterDTO character) {
        if (character == null) {
            return CharacterDTO.builder()
                .name(DEFAULT_NAME)
                .imageUrl(DEFAULT_IMAGE)
                .description(DEFAULT_DESCRIPTION)
                .build();
        }
        
        return CharacterDTO.builder()
            .id(character.getId())
            .externalId(character.getExternalId())
            .name(character.getName() != null && !character.getName().isBlank() 
                ? character.getName() 
                : DEFAULT_NAME)
            .source(character.getSource())
            .imageUrl(character.getImageUrl() != null && !character.getImageUrl().isBlank() 
                ? character.getImageUrl() 
                : DEFAULT_IMAGE)
            .description(character.getDescription() != null && !character.getDescription().isBlank() 
                ? character.getDescription() 
                : DEFAULT_DESCRIPTION)
            .build();
    }
    
    /**
     * Converts a Character entity to a CharacterDTO
     * 
     * @param character the Character entity
     * @return the CharacterDTO
     */
    public static CharacterDTO toDTO(Character character) {
        if (character == null) {
            return null;
        }
        
        return CharacterDTO.builder()
            .id(character.getId())
            .externalId(character.getExternalId())
            .name(character.getName())
            .source(character.getSource())
            .imageUrl(character.getImageUrl())
            .description(character.getDescription())
            .build();
    }
    
    /**
     * Converts a Character entity to a CharacterStatsDTO with calculated percentages
     * 
     * @param character the Character entity
     * @return the CharacterStatsDTO
     */
    public static CharacterStatsDTO toStatsDTO(Character character) {
        if (character == null) {
            return null;
        }
        
        return CharacterStatsDTO.builder()
            .id(character.getId())
            .externalId(character.getExternalId())
            .name(character.getName())
            .source(character.getSource())
            .imageUrl(character.getImageUrl())
            .description(character.getDescription())
            .totalLikes(character.getTotalLikes())
            .totalDislikes(character.getTotalDislikes())
            .totalVotes(character.getTotalVotes())
            .likePercentage(character.getLikePercentage())
            .dislikePercentage(character.getDislikePercentage())
            .build();
    }
    
    /**
     * Converts a CharacterDTO to a Character entity
     * 
     * @param dto the CharacterDTO
     * @return the Character entity
     */
    public static Character toEntity(CharacterDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Character character = new Character();
        character.setId(dto.getId());
        character.setExternalId(dto.getExternalId());
        character.setName(dto.getName());
        character.setSource(dto.getSource());
        character.setImageUrl(dto.getImageUrl());
        character.setDescription(dto.getDescription());
        character.setTotalLikes(0);
        character.setTotalDislikes(0);
        character.setTotalVotes(0);
        
        return character;
    }
}
