package com.pikapikamatch.service;

import com.pikapikamatch.exception.ExternalApiException;
import com.pikapikamatch.exception.ResourceNotFoundException;
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
import org.springframework.transaction.annotation.Transactional;

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
     * Gets a character's status by name from the database.
     *
     * @param name The character name to search for (case-insensitive)
     * @return CharacterStatsDTO with the character's statistics
     * @throws com.pikapikamatch.exception.ResourceNotFoundException if character not found
     */
    public CharacterStatsDTO getCharacterByName(String name) {
        log.debug("Fetching character status for: {}", name);
        
        // Search for character in the database (case-insensitive)
        Optional<Character> characterOpt = characterRepository.findByNameIgnoreCase(name);
        
        if (characterOpt.isEmpty()) {
            log.warn("Character not found in database: {}", name);
            throw new com.pikapikamatch.exception.ResourceNotFoundException(
                "Character not found: " + name
            );
        }
        
        Character character = characterOpt.get();
        log.info("Found character '{}' in database with {} votes", 
            character.getName(), character.getTotalVotes());
        
        return CharacterMapper.toStatsDTO(character);
    }

    /**
     * Adds likes to a character by name.
     *
     * @param name The character name to search for (case-insensitive)
     * @param amount The amount of likes to add
     * @return CharacterStatsDTO with updated statistics
     * @throws com.pikapikamatch.exception.ResourceNotFoundException if character not found
     */
    @Transactional
    public CharacterStatsDTO addLikesByName(String name, Integer amount) {
        log.debug("Adding {} likes to character: {}", amount, name);
        
        // Search for character in the database (case-insensitive)
        Optional<Character> characterOpt = characterRepository.findByNameIgnoreCase(name);
        
        if (characterOpt.isEmpty()) {
            log.warn("Character not found in database: {}", name);
            throw new com.pikapikamatch.exception.ResourceNotFoundException(
                "Character not found: " + name
            );
        }
        
        Character character = characterOpt.get();
        
        // Increment like counter by the specified amount
        character.setTotalLikes(character.getTotalLikes() + amount);
        character.setTotalVotes(character.getTotalLikes() + character.getTotalDislikes());
        
        Character updatedCharacter = characterRepository.save(character);
        log.info("Added {} likes to '{}': {} total likes, {} total votes", 
            amount,
            updatedCharacter.getName(), 
            updatedCharacter.getTotalLikes(),
            updatedCharacter.getTotalVotes());
        
        return CharacterMapper.toStatsDTO(updatedCharacter);
    }

    /**
     * Adds dislikes to a character by name.
     *
     * @param name The character name to search for (case-insensitive)
     * @param amount The amount of dislikes to add
     * @return CharacterStatsDTO with updated statistics
     * @throws com.pikapikamatch.exception.ResourceNotFoundException if character not found
     */
    @Transactional
    public CharacterStatsDTO addDislikesByName(String name, Integer amount) {
        log.debug("Adding {} dislikes to character: {}", amount, name);
        
        // Search for character in the database (case-insensitive)
        Optional<Character> characterOpt = characterRepository.findByNameIgnoreCase(name);
        
        if (characterOpt.isEmpty()) {
            log.warn("Character not found in database: {}", name);
            throw new ResourceNotFoundException(
                "Character not found: " + name
            );
        }
        
        Character character = characterOpt.get();
        
        // Increment dislike counter by the specified amount
        character.setTotalDislikes(character.getTotalDislikes() + amount);
        character.setTotalVotes(character.getTotalLikes() + character.getTotalDislikes());
        
        Character updatedCharacter = characterRepository.save(character);
        log.info("Added {} dislikes to '{}': {} total dislikes, {} total votes", 
            amount,
            updatedCharacter.getName(), 
            updatedCharacter.getTotalDislikes(),
            updatedCharacter.getTotalVotes());
        
        return CharacterMapper.toStatsDTO(updatedCharacter);
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
