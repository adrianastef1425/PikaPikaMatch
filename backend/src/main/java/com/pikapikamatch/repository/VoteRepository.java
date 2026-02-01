package com.pikapikamatch.repository;

import com.pikapikamatch.model.entity.Vote;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Vote entity operations.
 * Provides CRUD operations and custom query methods for vote data access.
 */
@Repository
public interface VoteRepository extends MongoRepository<Vote, String> {

    /**
     * Finds the most recent vote by timestamp.
     * Used to get the last evaluated character.
     *
     * @return The most recent vote, or null if no votes exist
     */
    Vote findTopByOrderByTimestampDesc();

    /**
     * Finds the top N most recent votes ordered by timestamp (descending).
     * Used to get the recent evaluation history.
     *
     * @param pageable Pageable object containing limit and sort information
     * @return List of votes sorted by timestamp in descending order (most recent first)
     */
    List<Vote> findByOrderByTimestampDesc(Pageable pageable);
}
