package com.pikapikamatch.service;

import com.pikapikamatch.exception.ExternalApiException;
import com.pikapikamatch.model.dto.CharacterStatsDTO;
import com.pikapikamatch.model.entity.Character;
import com.pikapikamatch.repository.CharacterRepository;
import com.pikapikamatch.util.CharacterMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing character statistics operations.
 * Provides methods to query rankings and statistics of characters
 * based on likes and dislikes.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class StatsService {

    private final CharacterRepository characterRepository;

    /**
     * Gets the character with the most likes.
     *
     * @return CharacterStatsDTO with the most liked character
     * @throws ExternalApiException if no characters exist in the database
     */
    public CharacterStatsDTO getMostLiked() {
        log.debug("Fetching most liked character");
        
        Character mostLiked = characterRepository.findTopByOrderByTotalLikesDesc();
        
        if (mostLiked == null) {
            log.warn("No characters found in database");
            throw new ExternalApiException("No characters available");
        }
        
        log.info("Most liked character: {} with {} likes", 
            mostLiked.getName(), mostLiked.getTotalLikes());
        
        return CharacterMapper.toStatsDTO(mostLiked);
    }

    /**
     * Gets the character with the most dislikes.
     *
     * @return CharacterStatsDTO with the most disliked character
     * @throws ExternalApiException if no characters exist in the database
     */
    public CharacterStatsDTO getMostDisliked() {
        log.debug("Fetching most disliked character");
        
        Character mostDisliked = characterRepository.findTopByOrderByTotalDislikesDesc();
        
        if (mostDisliked == null) {
            log.warn("No characters found in database");
            throw new ExternalApiException("No characters available");
        }
        
        log.info("Most disliked character: {} with {} dislikes", 
            mostDisliked.getName(), mostDisliked.getTotalDislikes());
        
        return CharacterMapper.toStatsDTO(mostDisliked);
    }

    /**
     * Gets the top N characters with the most likes.
     *
     * @param limit The maximum number of characters to return (default: 5)
     * @return List of CharacterStatsDTO sorted by likes in descending order
     */
    public List<CharacterStatsDTO> getTopLiked(Integer limit) {
        log.debug("Fetching top {} liked characters", limit);
        
        List<Character> topLiked = characterRepository.findTopByOrderByTotalLikesDesc(limit);
        
        log.info("Found {} top liked characters", topLiked.size());
        
        return topLiked.stream()
            .map(CharacterMapper::toStatsDTO)
            .collect(Collectors.toList());
    }

    /**
     * Gets the top N characters with the most dislikes.
     *
     * @param limit The maximum number of characters to return (default: 5)
     * @return List of CharacterStatsDTO sorted by dislikes in descending order
     */
    public List<CharacterStatsDTO> getTopDisliked(Integer limit) {
        log.debug("Fetching top {} disliked characters", limit);
        
        List<Character> topDisliked = characterRepository.findTopByOrderByTotalDislikesDesc(limit);
        
        log.info("Found {} top disliked characters", topDisliked.size());
        
        return topDisliked.stream()
            .map(CharacterMapper::toStatsDTO)
            .collect(Collectors.toList());
    }
}
