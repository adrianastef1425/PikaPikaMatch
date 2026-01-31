package com.pikapikamatch.service;

import com.pikapikamatch.exception.ExternalApiException;
import com.pikapikamatch.model.dto.CharacterDTO;
import com.pikapikamatch.model.dto.CharacterStatsDTO;
import com.pikapikamatch.model.dto.VoteRequestDTO;
import com.pikapikamatch.model.entity.Character;
import com.pikapikamatch.repository.CharacterRepository;
import com.pikapikamatch.service.external.PokeApiService;
import com.pikapikamatch.service.external.RickAndMortyApiService;
import com.pikapikamatch.service.external.SuperHeroApiService;
import com.pikapikamatch.util.CharacterMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * Service for managing character operations.
 * Handles fetching characters from external APIs with failover logic,
 * database lookups, and character creation.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final PokeApiService pokeApiService;
    private final RickAndMortyApiService rickAndMortyApiService;
    private final SuperHeroApiService superHeroApiService;
    private final RetryService retryService;
    
    private final Random random = new Random();

    /**
     * Gets a random character from one of the external APIs.
     * Implements failover logic to try different APIs if one fails.
     * Uses retry service for resilience.
     *
     * @return CharacterDTO from a random external API
     * @throws ExternalApiException if all APIs fail
     */
    public CharacterDTO getRandomCharacter() {
        log.debug("Fetching random character from external APIs");
        
        // Create a shuffled list of API sources to try
        List<String> apiSources = new ArrayList<>(List.of("pokemon", "rickandmorty", "superhero"));
        Collections.shuffle(apiSources);
        
        Exception lastException = null;
        
        // Try each API source with failover
        for (String source : apiSources) {
            try {
                log.debug("Attempting to fetch character from: {}", source);
                CharacterDTO character = fetchFromApi(source);
                log.info("Successfully fetched character from {}: {}", source, character.getName());
                return character;
            } catch (Exception e) {
                log.warn("Failed to fetch character from {}: {}", source, e.getMessage());
                lastException = e;
                // Continue to next API source
            }
        }
        
        // All APIs failed
        log.error("All external APIs failed to provide a character");
        throw new ExternalApiException("All external APIs are unavailable", lastException);
    }

    /**
     * Gets Pikachu's status from the database, or fetches from PokeAPI if not found.
     *
     * @return CharacterStatsDTO with Pikachu's statistics
     * @throws ExternalApiException if Pikachu cannot be found in database or API
     */
    public CharacterStatsDTO getPikachuStatus() {
        log.debug("Fetching Pikachu status");
        
        // First, try to find Pikachu in the database
        Optional<Character> pikachuOpt = characterRepository.findByNameIgnoreCase("Pikachu");
        
        if (pikachuOpt.isPresent()) {
            log.info("Found Pikachu in database with {} votes", pikachuOpt.get().getTotalVotes());
            return CharacterMapper.toStatsDTO(pikachuOpt.get());
        }
        
        // If not in database, fetch from PokeAPI
        log.debug("Pikachu not found in database, fetching from PokeAPI");
        try {
            CharacterDTO pikachuDTO = retryService.executeWithRetry(
                () -> pokeApiService.getPokemonByName("pikachu"),
                "PokeAPI-Pikachu"
            );
            
            // Convert to CharacterStatsDTO with zero votes
            CharacterStatsDTO stats = CharacterStatsDTO.builder()
                .id(pikachuDTO.getId())
                .externalId(pikachuDTO.getExternalId())
                .name(pikachuDTO.getName())
                .source(pikachuDTO.getSource())
                .imageUrl(pikachuDTO.getImageUrl())
                .description(pikachuDTO.getDescription())
                .totalLikes(0)
                .totalDislikes(0)
                .totalVotes(0)
                .likePercentage(0.0)
                .dislikePercentage(0.0)
                .build();
            
            log.info("Successfully fetched Pikachu from PokeAPI (no votes yet)");
            return stats;
        } catch (Exception e) {
            log.error("Failed to fetch Pikachu from PokeAPI", e);
            throw new ExternalApiException("Pikachu data is unavailable", e);
        }
    }

    /**
     * Finds an existing character or creates a new one based on vote request data.
     * Used by VoteService to ensure character exists before creating a vote.
     *
     * @param voteRequest The vote request containing character information
     * @return The existing or newly created Character entity
     */
    public Character findOrCreateCharacter(VoteRequestDTO voteRequest) {
        log.debug("Finding or creating character: {} from {}", 
            voteRequest.getCharacterName(), voteRequest.getCharacterSource());
        
        // Try to find existing character by externalId and source
        Optional<Character> existingCharacter = characterRepository.findByExternalIdAndSource(
            voteRequest.getCharacterId(), 
            voteRequest.getCharacterSource()
        );
        
        if (existingCharacter.isPresent()) {
            log.debug("Found existing character: {}", existingCharacter.get().getName());
            return existingCharacter.get();
        }
        
        // Create new character
        log.info("Creating new character: {} from {}", 
            voteRequest.getCharacterName(), voteRequest.getCharacterSource());
        
        Character newCharacter = new Character();
        newCharacter.setExternalId(voteRequest.getCharacterId());
        newCharacter.setName(voteRequest.getCharacterName());
        newCharacter.setSource(voteRequest.getCharacterSource());
        newCharacter.setImageUrl(voteRequest.getImageUrl());
        newCharacter.setDescription(voteRequest.getDescription());
        newCharacter.setTotalLikes(0);
        newCharacter.setTotalDislikes(0);
        newCharacter.setTotalVotes(0);
        
        Character savedCharacter = characterRepository.save(newCharacter);
        log.info("Successfully created new character with ID: {}", savedCharacter.getId());
        
        return savedCharacter;
    }

    /**
     * Fetches a character from a specific API source with retry logic.
     *
     * @param source The API source ("pokemon", "rickandmorty", or "superhero")
     * @return CharacterDTO from the specified API
     * @throws ExternalApiException if the API call fails after retries
     */
    private CharacterDTO fetchFromApi(String source) {
        return switch (source) {
            case "pokemon" -> retryService.executeWithRetry(
                pokeApiService::getRandomPokemon,
                "PokeAPI"
            );
            case "rickandmorty" -> retryService.executeWithRetry(
                rickAndMortyApiService::getRandomCharacter,
                "RickAndMortyAPI"
            );
            case "superhero" -> retryService.executeWithRetry(
                superHeroApiService::getRandomSuperhero,
                "SuperHeroAPI"
            );
            default -> throw new IllegalArgumentException("Unknown API source: " + source);
        };
    }
}
