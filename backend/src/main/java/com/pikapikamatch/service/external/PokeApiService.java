package com.pikapikamatch.service.external;

import com.pikapikamatch.model.dto.CharacterDTO;
import com.pikapikamatch.util.CharacterMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
public class PokeApiService {

    private final RestTemplate restTemplate;
    
    private final Random random = new Random();
    private static final int MAX_POKEMON_ID = 898; // Gen 1-8

    public PokeApiService(@Qualifier("pokeApiRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CharacterDTO getRandomPokemon() {
        int pokemonId = random.nextInt(MAX_POKEMON_ID) + 1;
        log.debug("Fetching Pokemon with ID: {}", pokemonId);
        
        try {
            return getPokemonById(pokemonId);
        } catch (RestClientException e) {
            log.error("Failed to fetch Pokemon with ID: {}", pokemonId, e);
            throw e;
        }
    }

    public CharacterDTO getPokemonByName(String name) {
        log.debug("Fetching Pokemon by name: {}", name);
        
        try {
            return getPokemonByNameOrId(name.toLowerCase());
        } catch (RestClientException e) {
            log.error("Failed to fetch Pokemon with name: {}", name, e);
            throw e;
        }
    }

    private CharacterDTO getPokemonById(int id) {
        return getPokemonByNameOrId(String.valueOf(id));
    }

    @SuppressWarnings("unchecked")
    private CharacterDTO getPokemonByNameOrId(String nameOrId) {
        // Fetch Pokemon data
        Map<String, Object> pokemonData = restTemplate.getForObject(
                "/pokemon/" + nameOrId, Map.class);
        
        if (pokemonData == null) {
            throw new RestClientException("Pokemon data is null");
        }

        // Extract basic info
        Integer id = (Integer) pokemonData.get("id");
        String name = capitalize((String) pokemonData.get("name"));
        
        // Extract image URL
        String imageUrl = extractImageUrl(pokemonData);
        
        // Fetch species data for description
        String description = fetchPokemonDescription(pokemonData);
        
        log.info("Successfully fetched Pokemon: {}", name);
        
        CharacterDTO character = CharacterDTO.builder()
                .id(String.valueOf(id))
                .externalId(String.valueOf(id))
                .name(name)
                .source("pokemon")
                .imageUrl(imageUrl)
                .description(description)
                .build();
        
        return CharacterMapper.withDefaults(character);
    }

    @SuppressWarnings("unchecked")
    private String extractImageUrl(Map<String, Object> pokemonData) {
        try {
            Map<String, Object> sprites = (Map<String, Object>) pokemonData.get("sprites");
            if (sprites != null) {
                Map<String, Object> other = (Map<String, Object>) sprites.get("other");
                if (other != null) {
                    Map<String, Object> officialArtwork = (Map<String, Object>) other.get("official-artwork");
                    if (officialArtwork != null) {
                        String frontDefault = (String) officialArtwork.get("front_default");
                        if (frontDefault != null) {
                            return frontDefault;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to extract official artwork, using fallback", e);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private String fetchPokemonDescription(Map<String, Object> pokemonData) {
        try {
            Map<String, Object> species = (Map<String, Object>) pokemonData.get("species");
            if (species == null) {
                return null;
            }
            
            String speciesUrl = (String) species.get("url");
            if (speciesUrl == null) {
                return null;
            }
            
            // Extract the path from the full URL
            String path = speciesUrl.replace("https://pokeapi.co/api/v2", "");
            
            Map<String, Object> speciesData = restTemplate.getForObject(path, Map.class);
            if (speciesData == null) {
                return null;
            }
            
            return extractEnglishDescription(speciesData);
        } catch (Exception e) {
            log.warn("Failed to fetch Pokemon description", e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private String extractEnglishDescription(Map<String, Object> speciesData) {
        try {
            List<Map<String, Object>> flavorTextEntries = 
                    (List<Map<String, Object>>) speciesData.get("flavor_text_entries");
            
            if (flavorTextEntries == null || flavorTextEntries.isEmpty()) {
                return null;
            }
            
            // Find English flavor text
            for (Map<String, Object> entry : flavorTextEntries) {
                Map<String, Object> language = (Map<String, Object>) entry.get("language");
                if (language != null && "en".equals(language.get("name"))) {
                    String flavorText = (String) entry.get("flavor_text");
                    if (flavorText != null) {
                        // Clean up the text (remove newlines and extra spaces)
                        return flavorText.replaceAll("\\s+", " ").trim();
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to extract English description", e);
        }
        return null;
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
