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
public class SuperHeroApiService {

    private final RestTemplate restTemplate;
    
    private final Random random = new Random();
    private static final int MAX_SUPERHERO_ID = 731;

    public SuperHeroApiService(@Qualifier("superheroRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CharacterDTO getRandomSuperhero() {
        int superheroId = random.nextInt(MAX_SUPERHERO_ID) + 1;
        log.debug("Fetching Superhero with ID: {}", superheroId);
        
        try {
            return getSuperheroById(superheroId);
        } catch (RestClientException e) {
            log.error("Failed to fetch Superhero with ID: {}", superheroId, e);
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    private CharacterDTO getSuperheroById(int id) {
        Map<String, Object> superheroData = restTemplate.getForObject(
                "/" + id, Map.class);
        
        if (superheroData == null) {
            throw new RestClientException("Superhero data is null");
        }

        // Check for error response
        String response = (String) superheroData.get("response");
        if ("error".equals(response)) {
            throw new RestClientException("Superhero API returned error: " + superheroData.get("error"));
        }

        // Extract basic info
        String superheroId = String.valueOf(superheroData.get("id"));
        String name = (String) superheroData.get("name");
        
        // Extract image URL
        String imageUrl = extractImageUrl(superheroData);
        
        // Build description from biography and work
        String description = buildDescription(superheroData);
        
        log.info("Successfully fetched Superhero: {}", name);
        
        CharacterDTO character = CharacterDTO.builder()
                .id(superheroId)
                .externalId(superheroId)
                .name(name)
                .source("superhero")
                .imageUrl(imageUrl)
                .description(description)
                .build();
        
        return CharacterMapper.withDefaults(character);
    }

    @SuppressWarnings("unchecked")
    private String extractImageUrl(Map<String, Object> superheroData) {
        try {
            Map<String, Object> image = (Map<String, Object>) superheroData.get("image");
            if (image != null) {
                return (String) image.get("url");
            }
        } catch (Exception e) {
            log.warn("Failed to extract image URL", e);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private String buildDescription(Map<String, Object> superheroData) {
        try {
            StringBuilder description = new StringBuilder();
            
            // Get biography info
            Map<String, Object> biography = (Map<String, Object>) superheroData.get("biography");
            if (biography != null) {
                String fullName = (String) biography.get("full-name");
                if (fullName != null && !fullName.isEmpty() && !"-".equals(fullName)) {
                    description.append(fullName);
                }
            }
            
            // Get work info
            Map<String, Object> work = (Map<String, Object>) superheroData.get("work");
            if (work != null) {
                String occupation = (String) work.get("occupation");
                if (occupation != null && !occupation.isEmpty() && !"-".equals(occupation)) {
                    if (description.length() > 0) {
                        description.append(" - ");
                    }
                    description.append(occupation);
                }
            }
            
            return description.length() > 0 ? description.toString() : null;
        } catch (Exception e) {
            log.warn("Failed to build description for Superhero", e);
            return null;
        }
    }
}
