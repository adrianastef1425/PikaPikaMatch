package com.pikapikamatch.service;

import com.pikapikamatch.model.dto.VoteRequestDTO;
import com.pikapikamatch.model.dto.VoteResponseDTO;
import com.pikapikamatch.model.entity.Character;
import com.pikapikamatch.model.entity.Vote;
import com.pikapikamatch.repository.CharacterRepository;
import com.pikapikamatch.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final CharacterRepository characterRepository;
    private final CharacterService characterService;

    @Transactional
    public VoteResponseDTO createVote(VoteRequestDTO request) {
        log.debug("Creating vote for character: {} ({})", 
            request.getCharacterName(), request.getVoteType());
        
        Character character = characterService.findOrCreateCharacter(request);
        
        if ("like".equals(request.getVoteType())) {
            character.setTotalLikes(character.getTotalLikes() + 1);
            log.debug("Incremented likes for {}: {}", character.getName(), character.getTotalLikes());
        } else if ("dislike".equals(request.getVoteType())) {
            character.setTotalDislikes(character.getTotalDislikes() + 1);
            log.debug("Incremented dislikes for {}: {}", character.getName(), character.getTotalDislikes());
        }
        
        character.setTotalVotes(character.getTotalLikes() + character.getTotalDislikes());
        
        Character updatedCharacter = characterRepository.save(character);
        log.info("Updated character counters for {}: {} likes, {} dislikes, {} total",
            updatedCharacter.getName(),
            updatedCharacter.getTotalLikes(),
            updatedCharacter.getTotalDislikes(),
            updatedCharacter.getTotalVotes());
        
        Vote vote = new Vote();
        vote.setCharacter(updatedCharacter);
        vote.setVoteType(request.getVoteType());
        vote.setTimestamp(LocalDateTime.now());
        
        Vote savedVote = voteRepository.save(vote);
        log.info("Successfully created vote with ID: {} for character: {}", 
            savedVote.getId(), updatedCharacter.getName());
        
        return VoteResponseDTO.builder()
            .voteId(savedVote.getId())
            .characterId(updatedCharacter.getId())
            .characterName(updatedCharacter.getName())
            .characterSource(updatedCharacter.getSource())
            .imageUrl(updatedCharacter.getImageUrl())
            .description(updatedCharacter.getDescription())
            .voteType(savedVote.getVoteType())
            .timestamp(savedVote.getTimestamp())
            .build();
    }

    public List<VoteResponseDTO> getRecentVotes(Integer limit) {
        log.debug("Fetching {} most recent votes", limit);
        
        PageRequest pageRequest = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "timestamp"));
        List<Vote> recentVotes = voteRepository.findByOrderByTimestampDesc(pageRequest);
        
        log.info("Found {} recent votes", recentVotes.size());
        
        return recentVotes.stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    public VoteResponseDTO getLastEvaluated() {
        log.debug("Fetching last evaluated character");
        
        Vote lastVote = voteRepository.findTopByOrderByTimestampDesc();
        
        if (lastVote == null) {
            log.info("No votes found in database");
            return null;
        }
        
        log.info("Found last evaluated character: {}", lastVote.getCharacter().getName());
        
        return convertToResponseDTO(lastVote);
    }

    private VoteResponseDTO convertToResponseDTO(Vote vote) {
        Character character = vote.getCharacter();
        
        return VoteResponseDTO.builder()
            .voteId(vote.getId())
            .characterId(character.getId())
            .characterName(character.getName())
            .characterSource(character.getSource())
            .imageUrl(character.getImageUrl())
            .description(character.getDescription())
            .voteType(vote.getVoteType())
            .timestamp(vote.getTimestamp())
            .build();
    }
}
