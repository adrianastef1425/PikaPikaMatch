package com.pikapikamatch.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Vote entity representing a single vote (like or dislike) for a character.
 * References the Character entity via DBRef.
 */
@Document(collection = "votes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    /**
     * MongoDB document ID
     */
    @Id
    private String id;

    /**
     * Reference to the Character that was voted on
     */
    @Indexed
    @DBRef
    private Character character;

    /**
     * Type of vote: "like" or "dislike"
     */
    @Indexed
    private String voteType;

    /**
     * Timestamp when the vote was cast
     */
    @Indexed
    private LocalDateTime timestamp;

    /**
     * Timestamp when the vote document was created
     */
    @CreatedDate
    private LocalDateTime createdAt;
}
