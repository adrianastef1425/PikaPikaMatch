package com.pikapikamatch.controller;

import com.pikapikamatch.exception.ResourceNotFoundException;
import com.pikapikamatch.model.dto.Response;
import com.pikapikamatch.model.dto.VoteRequestDTO;
import com.pikapikamatch.model.dto.VoteResponseDTO;
import com.pikapikamatch.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for vote-related endpoints.
 * Provides endpoints to create votes, query recent votes, and get the last evaluated character.
 */
@RestController
@RequestMapping("/api/votes")
@Tag(name = "Votes", description = "Vote management endpoints")
@RequiredArgsConstructor
@Slf4j
@Validated
public class VoteController {

    private final VoteService voteService;

    /**
     * Creates a new vote for a character.
     * If the character doesn't exist in the database, it will be created.
     * Updates the character's like/dislike counters accordingly.
     *
     * @param request The vote request containing character and vote information
     * @return ResponseEntity with Response containing VoteResponseDTO
     */
    @Operation(
        summary = "Create a vote",
        description = "Creates a new vote (like or dislike) for a character. " +
                     "If the character doesn't exist in the database, it will be created with initialized counters. " +
                     "Updates the character's vote counters atomically."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Vote created successfully",
            content = @Content(schema = @Schema(implementation = VoteResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request data (missing fields or invalid vote type)",
            content = @Content(schema = @Schema(implementation = Response.class))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @PostMapping
    public ResponseEntity<Response<VoteResponseDTO>> createVote(
            @Valid @RequestBody VoteRequestDTO request) {
        log.info("POST /api/votes - Creating vote for character: {} ({})", 
            request.getCharacterName(), request.getVoteType());
        
        VoteResponseDTO response = voteService.createVote(request);
        
        log.info("Successfully created vote with ID: {} for character: {}", 
            response.getVoteId(), response.getCharacterName());
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(Response.success("Vote created successfully", response));
    }

    /**
     * Gets the most recent N votes with complete character information.
     *
     * @param limit The maximum number of votes to return (default: 10, min: 1, max: 50)
     * @return ResponseEntity with Response containing list of VoteResponseDTO
     */
    @Operation(
        summary = "Get recent votes",
        description = "Returns the most recent N votes with complete character information, " +
                     "sorted by timestamp in descending order (most recent first)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Recent votes retrieved successfully",
            content = @Content(schema = @Schema(implementation = VoteResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid limit parameter (must be between 1 and 50)",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @GetMapping("/recent")
    public ResponseEntity<Response<List<VoteResponseDTO>>> getRecentVotes(
            @RequestParam(defaultValue = "10") 
            @Min(value = 1, message = "Limit must be at least 1")
            @Max(value = 50, message = "Limit must not exceed 50")
            Integer limit) {
        log.info("GET /api/votes/recent - Fetching {} recent votes", limit);
        
        List<VoteResponseDTO> recentVotes = voteService.getRecentVotes(limit);
        
        log.info("Successfully retrieved {} recent votes", recentVotes.size());
        
        return ResponseEntity.ok(Response.success(recentVotes));
    }

    /**
     * Gets the last evaluated character (most recent vote).
     *
     * @return ResponseEntity with Response containing VoteResponseDTO
     */
    @Operation(
        summary = "Get last evaluated character",
        description = "Returns the most recent vote with complete character information. " +
                     "This represents the last character that was evaluated by any user."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Last evaluated character retrieved successfully",
            content = @Content(schema = @Schema(implementation = VoteResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "No evaluations have been made yet",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @GetMapping("/last")
    public ResponseEntity<Response<VoteResponseDTO>> getLastEvaluated() {
        log.info("GET /api/votes/last - Fetching last evaluated character");
        
        VoteResponseDTO lastVote = voteService.getLastEvaluated();
        
        if (lastVote == null) {
            log.info("No votes found in database");
            throw new ResourceNotFoundException("No evaluations have been made yet");
        }
        
        log.info("Successfully retrieved last evaluated character: {}", 
            lastVote.getCharacterName());
        
        return ResponseEntity.ok(Response.success(lastVote));
    }
}
