package com.pikapikamatch.service.external;

import com.pikapikamatch.model.dto.CharacterDTO;
import com.pikapikamatch.util.CharacterMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Random;

@Service
@Slf4j
public class RickAndMortyApiService {

    private final RestTemplate restTemplate;
    
    private final Random random = new Random();
    private static final int MAX_CHARACTER_ID = 826;

    public RickAndMortyApiService(@Qualifier("rickAndMortyRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CharacterDTO getRandomCharacter() {
        int characterId = random.nextInt(MAX_CHARACTER_ID) + 1;
        log.debug("Fetching Rick and Morty character with ID: {}", characterId);
        
        try {
            return getCharacterById(characterId);
        } catch (RestClientException e) {
            log.error("Failed to fetch Rick and Morty character with ID: {}", characterId, e);
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    private CharacterDTO getCharacterById(int id) {
        Map<String, Object> characterData = restTemplate.getForObject(
                "/character/" + id, Map.class);
        
        if (characterData == null) {
            throw new RestClientException("Character data is null");
        }

        // Extract basic info
        Integer characterId = (Integer) characterData.get("id");
        String name = (String) characterData.get("name");
        String imageUrl = (String) characterData.get("image");
        
        // Build description from species, status, and origin
        String description = buildDescription(characterData);
        
        log.info("Successfully fetched Rick and Morty character: {}", name);
        
        CharacterDTO character = CharacterDTO.builder()
                .id(String.valueOf(characterId))
                .externalId(String.valueOf(characterId))
                .name(name)
                .source("rickandmorty")
                .imageUrl(imageUrl)
                .description(description)
                .build();
        
        return CharacterMapper.withDefaults(character);
    }

    @SuppressWarnings("unchecked")
    private String buildDescription(Map<String, Object> characterData) {
        try {
            String species = (String) characterData.get("species");
            String status = (String) characterData.get("status");
            
            Map<String, Object> origin = (Map<String, Object>) characterData.get("origin");
            String originName = origin != null ? (String) origin.get("name") : "Unknown";
            
            // Build description: "Species - Status from Origin"
            StringBuilder description = new StringBuilder();
            
            if (species != null && !species.isEmpty()) {
                description.append(species);
            }
            
            if (status != null && !status.isEmpty()) {
                if (description.length() > 0) {
                    description.append(" - ");
                }
                description.append(status);
            }
            
            if (originName != null && !originName.isEmpty() && !"unknown".equalsIgnoreCase(originName)) {
                if (description.length() > 0) {
                    description.append(" from ");
                }
                description.append(originName);
            }
            
            return description.length() > 0 ? description.toString() : null;
        } catch (Exception e) {
            log.warn("Failed to build description for Rick and Morty character", e);
            return null;
        }
    }
}
