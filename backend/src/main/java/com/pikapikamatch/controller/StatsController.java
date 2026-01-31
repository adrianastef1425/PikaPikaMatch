package com.pikapikamatch.controller;

import com.pikapikamatch.model.dto.Response;
import com.pikapikamatch.model.dto.CharacterStatsDTO;
import com.pikapikamatch.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for statistics-related endpoints.
 * Provides endpoints to query character rankings and statistics based on likes and dislikes.
 */
@RestController
@RequestMapping("/api/stats")
@Tag(name = "Statistics", description = "Statistics endpoints")
@RequiredArgsConstructor
@Slf4j
@Validated
public class StatsController {

    private final StatsService statsService;

    /**
     * Gets the character with the most likes.
     *
     * @return ResponseEntity with Response containing CharacterStatsDTO
     */
    @Operation(
        summary = "Get most liked character",
        description = "Returns the character with the highest number of likes, " +
                     "including complete statistics (likes, dislikes, percentages)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Most liked character retrieved successfully",
            content = @Content(schema = @Schema(implementation = CharacterStatsDTO.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "No characters available in the database",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @GetMapping("/most-liked")
    public ResponseEntity<Response<CharacterStatsDTO>> getMostLiked() {
        log.info("GET /api/stats/most-liked - Fetching most liked character");
        
        CharacterStatsDTO mostLiked = statsService.getMostLiked();
        
        log.info("Successfully retrieved most liked character: {} with {} likes", 
            mostLiked.getName(), mostLiked.getTotalLikes());
        
        return ResponseEntity.ok(Response.success(mostLiked));
    }

    /**
     * Gets the character with the most dislikes.
     *
     * @return ResponseEntity with Response containing CharacterStatsDTO
     */
    @Operation(
        summary = "Get most disliked character",
        description = "Returns the character with the highest number of dislikes, " +
                     "including complete statistics (likes, dislikes, percentages)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Most disliked character retrieved successfully",
            content = @Content(schema = @Schema(implementation = CharacterStatsDTO.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "No characters available in the database",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @GetMapping("/most-disliked")
    public ResponseEntity<Response<CharacterStatsDTO>> getMostDisliked() {
        log.info("GET /api/stats/most-disliked - Fetching most disliked character");
        
        CharacterStatsDTO mostDisliked = statsService.getMostDisliked();
        
        log.info("Successfully retrieved most disliked character: {} with {} dislikes", 
            mostDisliked.getName(), mostDisliked.getTotalDislikes());
        
        return ResponseEntity.ok(Response.success(mostDisliked));
    }

    /**
     * Gets the top N characters with the most likes.
     *
     * @param limit The maximum number of characters to return (default: 5, min: 1, max: 50)
     * @return ResponseEntity with Response containing list of CharacterStatsDTO
     */
    @Operation(
        summary = "Get top liked characters",
        description = "Returns the top N characters sorted by number of likes in descending order. " +
                     "Each character includes complete statistics (likes, dislikes, percentages)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Top liked characters retrieved successfully",
            content = @Content(schema = @Schema(implementation = CharacterStatsDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid limit parameter (must be between 1 and 50)",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @GetMapping("/top-liked")
    public ResponseEntity<Response<List<CharacterStatsDTO>>> getTopLiked(
            @RequestParam(defaultValue = "5") 
            @Min(value = 1, message = "Limit must be at least 1")
            @Max(value = 50, message = "Limit must not exceed 50")
            Integer limit) {
        log.info("GET /api/stats/top-liked - Fetching top {} liked characters", limit);
        
        List<CharacterStatsDTO> topLiked = statsService.getTopLiked(limit);
        
        log.info("Successfully retrieved {} top liked characters", topLiked.size());
        
        return ResponseEntity.ok(Response.success(topLiked));
    }

    /**
     * Gets the top N characters with the most dislikes.
     *
     * @param limit The maximum number of characters to return (default: 5, min: 1, max: 50)
     * @return ResponseEntity with Response containing list of CharacterStatsDTO
     */
    @Operation(
        summary = "Get top disliked characters",
        description = "Returns the top N characters sorted by number of dislikes in descending order. " +
                     "Each character includes complete statistics (likes, dislikes, percentages)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Top disliked characters retrieved successfully",
            content = @Content(schema = @Schema(implementation = CharacterStatsDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid limit parameter (must be between 1 and 50)",
            content = @Content(schema = @Schema(implementation = Response.class))
        )
    })
    @GetMapping("/top-disliked")
    public ResponseEntity<Response<List<CharacterStatsDTO>>> getTopDisliked(
            @RequestParam(defaultValue = "5") 
            @Min(value = 1, message = "Limit must be at least 1")
            @Max(value = 50, message = "Limit must not exceed 50")
            Integer limit) {
        log.info("GET /api/stats/top-disliked - Fetching top {} disliked characters", limit);
        
        List<CharacterStatsDTO> topDisliked = statsService.getTopDisliked(limit);
        
        log.info("Successfully retrieved {} top disliked characters", topDisliked.size());
        
        return ResponseEntity.ok(Response.success(topDisliked));
    }
}
