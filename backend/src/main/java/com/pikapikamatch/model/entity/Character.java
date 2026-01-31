package com.pikapikamatch.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Character entity representing a character from external APIs.
 * Stores aggregated voting statistics and character information.
 */
@Document(collection = "characters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@CompoundIndex(name = "externalId_source_idx", def = "{'externalId': 1, 'source': 1}", unique = true)
public class Character {

    /**
     * MongoDB document ID
     */
    @Id
    private String id;

    /**
     * External ID from the source API (e.g., Pokemon ID, Rick and Morty character ID)
     */
    @Indexed
    private String externalId;

    /**
     * Character name
     */
    @Indexed
    private String name;

    /**
     * Source of the character: "pokemon", "rickandmorty", or "superhero"
     */
    @Indexed
    private String source;

    /**
     * URL to character image
     */
    private String imageUrl;

    /**
     * Character description
     */
    private String description;

    /**
     * Total number of likes received
     */
    @Indexed
    private Integer totalLikes = 0;

    /**
     * Total number of dislikes received
     */
    @Indexed
    private Integer totalDislikes = 0;

    /**
     * Total number of votes (likes + dislikes)
     */
    private Integer totalVotes = 0;

    /**
     * Timestamp when the character was first created
     */
    @CreatedDate
    private LocalDateTime createdAt;

    /**
     * Timestamp when the character was last updated
     */
    @LastModifiedDate
    @Indexed
    private LocalDateTime lastUpdated;

    /**
     * Calculates the percentage of likes relative to total votes.
     *
     * @return Like percentage (0.0 to 100.0), or 0.0 if no votes exist
     */
    public Double getLikePercentage() {
        if (totalVotes == null || totalVotes == 0) {
            return 0.0;
        }
        return (totalLikes * 100.0) / totalVotes;
    }

    /**
     * Calculates the percentage of dislikes relative to total votes.
     *
     * @return Dislike percentage (0.0 to 100.0), or 0.0 if no votes exist
     */
    public Double getDislikePercentage() {
        if (totalVotes == null || totalVotes == 0) {
            return 0.0;
        }
        return (totalDislikes * 100.0) / totalVotes;
    }
}
