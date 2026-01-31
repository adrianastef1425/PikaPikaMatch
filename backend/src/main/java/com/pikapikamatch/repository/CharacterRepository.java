package com.pikapikamatch.repository;

import com.pikapikamatch.model.entity.Character;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Character entity operations.
 * Provides CRUD operations and custom query methods for character data access.
 */
@Repository
public interface CharacterRepository extends MongoRepository<Character, String> {

    /**
     * Finds a character by external ID and source.
     * Used to check if a character from a specific API already exists.
     *
     * @param externalId The external ID from the source API
     * @param source The source API name ("pokemon", "rickandmorty", "superhero")
     * @return Optional containing the character if found
     */
    Optional<Character> findByExternalIdAndSource(String externalId, String source);

    /**
     * Finds a character by name (case-insensitive).
     * Used for searching characters like Pikachu.
     *
     * @param name The character name to search for
     * @return Optional containing the character if found
     */
    Optional<Character> findByNameIgnoreCase(String name);

    /**
     * Finds the character with the most likes.
     * Returns the single character with the highest totalLikes count.
     *
     * @return The character with the most likes, or null if no characters exist
     */
    Character findTopByOrderByTotalLikesDesc();

    /**
     * Finds the character with the most dislikes.
     * Returns the single character with the highest totalDislikes count.
     *
     * @return The character with the most dislikes, or null if no characters exist
     */
    Character findTopByOrderByTotalDislikesDesc();

    /**
     * Finds the top N characters ordered by total likes (descending).
     * Used for getting rankings of most liked characters.
     *
     * @param limit The maximum number of characters to return
     * @return List of characters sorted by totalLikes in descending order
     */
    List<Character> findTopByOrderByTotalLikesDesc(Integer limit);

    /**
     * Finds the top N characters ordered by total dislikes (descending).
     * Used for getting rankings of most disliked characters.
     *
     * @param limit The maximum number of characters to return
     * @return List of characters sorted by totalDislikes in descending order
     */
    List<Character> findTopByOrderByTotalDislikesDesc(Integer limit);
}
