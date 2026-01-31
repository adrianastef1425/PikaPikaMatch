package com.pikapikamatch.controller;

import com.pikapikamatch.model.dto.Response;
import com.pikapikamatch.model.dto.CharacterDTO;
import com.pikapikamatch.model.dto.CharacterStatsDTO;
import com.pikapikamatch.service.CharacterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
     * Gets Pikachu's status with voting statistics.
     * Returns data from database if Pikachu has been voted on, otherwise fetches from PokeAPI.
     *
     * @return ResponseEntity with Response containing CharacterStatsDTO
     */
    @Operation(
        summary = "Get Pikachu status",
        description = "Returns Pikachu's voting statistics if available in the database, " +
                     "otherwise fetches Pikachu data from PokeAPI with zero votes."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Pikachu status retrieved successfully",
            content = @Content(schema = @Schema(implementation = CharacterStatsDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Pikachu data is unavailable",
            content = @Content(schema = @Schema(implementation = Response.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "503",
            description = "External API unavailable",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @GetMapping("/pikachu")
    public ResponseEntity<Response<CharacterStatsDTO>> getPikachuStatus() {
        log.info("GET /api/characters/pikachu - Fetching Pikachu status");
        
        CharacterStatsDTO pikachuStats = characterService.getPikachuStatus();
        
        log.info("Successfully retrieved Pikachu status: {} votes", pikachuStats.getTotalVotes());
        
        return ResponseEntity.ok(Response.success(pikachuStats));
    }
}
