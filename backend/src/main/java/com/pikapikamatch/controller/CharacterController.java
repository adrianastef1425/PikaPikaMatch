package com.pikapikamatch.controller;

import com.pikapikamatch.model.dto.Response;
import com.pikapikamatch.model.dto.CharacterDTO;
import com.pikapikamatch.model.dto.CharacterStatsDTO;
import com.pikapikamatch.model.dto.UpdateVoteCountDTO;
import com.pikapikamatch.service.CharacterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for character-related endpoints.
 * Provides endpoints to fetch random characters and query Pikachu status.
 */
@RestController
@RequestMapping("/api/characters")
@Tag(name = "Characters", description = "Character management endpoints")
@RequiredArgsConstructor
@Slf4j
public class CharacterController {

    private final CharacterService characterService;

    /**
     * Gets a random character from one of the external APIs (Pokemon, Rick and Morty, or Superhero).
     * Implements failover logic to try different APIs if one fails.
     *
     * @return ResponseEntity with Response containing CharacterDTO
     */
    @Operation(
        summary = "Get random character",
        description = "Returns a random character from Pokemon, Rick and Morty, or Superhero APIs. " +
                     "Implements automatic failover to try different APIs if one fails."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Character retrieved successfully",
            content = @Content(schema = @Schema(implementation = CharacterDTO.class))
        ),
        @ApiResponse(
            responseCode = "503",
            description = "All external APIs are unavailable",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @GetMapping("/random")
    public ResponseEntity<Response<CharacterDTO>> getRandomCharacter() {
        log.info("GET /api/characters/random - Fetching random character");
        
        CharacterDTO character = characterService.getRandomCharacter();
        
        log.info("Successfully retrieved random character: {} from {}", 
            character.getName(), character.getSource());
        
        return ResponseEntity.ok(Response.success(character));
    }

    /**
     * Gets a character's status by name from the database.
     * Returns voting statistics if the character has been voted on.
     *
     * @param name The character name to search for (case-insensitive)
     * @return ResponseEntity with Response containing CharacterStatsDTO
     */
    @Operation(
        summary = "Get character status by name",
        description = "Returns a character's voting statistics from the database by name. " +
                     "Search is case-insensitive."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Character status retrieved successfully",
            content = @Content(schema = @Schema(implementation = CharacterStatsDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Character not found in database",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @GetMapping("/{name}")
    public ResponseEntity<Response<CharacterStatsDTO>> getCharacterByName(
            @Parameter(
                description = "Character name to search for",
                example = "Pikachu"
            )
            @PathVariable String name) {
        log.info("GET /api/characters/{} - Fetching character status", name);
        
        CharacterStatsDTO characterStats = characterService.getCharacterByName(name);
        
        log.info("Successfully retrieved character status: {} with {} votes", 
            characterStats.getName(), characterStats.getTotalVotes());
        
        return ResponseEntity.ok(Response.success(characterStats));
    }

    /**
     * Adds likes to a character by name.
     * The character must exist in the database.
     *
     * @param name The character name (case-insensitive)
     * @param request The request containing the amount of likes to add
     * @return ResponseEntity with Response containing updated CharacterStatsDTO
     */
    @Operation(
        summary = "Add likes to character",
        description = "Increments the like counter for a character by the specified amount. " +
                     "The character must already exist in the database. " +
                     "Search is case-insensitive."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Likes added successfully",
            content = @Content(schema = @Schema(implementation = CharacterStatsDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request (amount must be at least 1)",
            content = @Content(schema = @Schema(implementation = Response.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Character not found in database",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @PatchMapping("/{name}/like")
    public ResponseEntity<Response<CharacterStatsDTO>> addLikes(
            @io.swagger.v3.oas.annotations.Parameter(
                description = "Character name to add likes",
                example = "Pikachu"
            )
            @PathVariable String name,
            @Valid @RequestBody UpdateVoteCountDTO request) {
        log.info("PATCH /api/characters/{}/like - Adding {} likes to character", name, request.getAmount());
        
        CharacterStatsDTO characterStats = characterService.addLikesByName(name, request.getAmount());
        
        log.info("Successfully added {} likes to {}: {} total likes", 
            request.getAmount(), characterStats.getName(), characterStats.getTotalLikes());
        
        return ResponseEntity.ok(Response.success("Likes added successfully", characterStats));
    }

    /**
     * Adds dislikes to a character by name.
     * The character must exist in the database.
     *
     * @param name The character name (case-insensitive)
     * @param request The request containing the amount of dislikes to add
     * @return ResponseEntity with Response containing updated CharacterStatsDTO
     */
    @Operation(
        summary = "Add dislikes to character",
        description = "Increments the dislike counter for a character by the specified amount. " +
                     "The character must already exist in the database. " +
                     "Search is case-insensitive."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Dislikes added successfully",
            content = @Content(schema = @Schema(implementation = CharacterStatsDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request (amount must be at least 1)",
            content = @Content(schema = @Schema(implementation = Response.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Character not found in database",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @PatchMapping("/{name}/dislike")
    public ResponseEntity<Response<CharacterStatsDTO>> addDislikes(
            @io.swagger.v3.oas.annotations.Parameter(
                description = "Character name to add dislikes",
                example = "Pikachu"
            )
            @PathVariable String name,
            @Valid @RequestBody UpdateVoteCountDTO request) {
        log.info("PATCH /api/characters/{}/dislike - Adding {} dislikes to character", name, request.getAmount());
        
        CharacterStatsDTO characterStats = characterService.addDislikesByName(name, request.getAmount());
        
        log.info("Successfully added {} dislikes to {}: {} total dislikes", 
            request.getAmount(), characterStats.getName(), characterStats.getTotalDislikes());
        
        return ResponseEntity.ok(Response.success("Dislikes added successfully", characterStats));
    }
}
