package com.pikapikamatch.service;

import com.pikapikamatch.model.dto.VoteRequestDTO;
import com.pikapikamatch.model.dto.VoteResponseDTO;
import com.pikapikamatch.model.entity.Character;
import com.pikapikamatch.model.entity.Vote;
import com.pikapikamatch.repository.CharacterRepository;
import com.pikapikamatch.repository.VoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @Mock
    private VoteRepository voteRepository;

    @Mock
    private CharacterRepository characterRepository;

    @Mock
    private CharacterService characterService;

    @InjectMocks
    private VoteService voteService;

    @Test
    void createVote_shouldIncrementLikes_whenVoteTypeIsLike() {
        // Given
        VoteRequestDTO request = createVoteRequest("like");
        Character character = createCharacter();
        Vote savedVote = createVote(character, "like");

        when(characterService.findOrCreateCharacter(request)).thenReturn(character);
        when(characterRepository.save(any(Character.class))).thenReturn(character);
        when(voteRepository.save(any(Vote.class))).thenReturn(savedVote);

        // When
        VoteResponseDTO result = voteService.createVote(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getVoteType()).isEqualTo("like");
        assertThat(character.getTotalLikes()).isEqualTo(1);
        verify(characterRepository).save(character);
        verify(voteRepository).save(any(Vote.class));
    }

    @Test
    void createVote_shouldIncrementDislikes_whenVoteTypeIsDislike() {
        // Given
        VoteRequestDTO request = createVoteRequest("dislike");
        Character character = createCharacter();
        Vote savedVote = createVote(character, "dislike");

        when(characterService.findOrCreateCharacter(request)).thenReturn(character);
        when(characterRepository.save(any(Character.class))).thenReturn(character);
        when(voteRepository.save(any(Vote.class))).thenReturn(savedVote);

        // When
        VoteResponseDTO result = voteService.createVote(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getVoteType()).isEqualTo("dislike");
        assertThat(character.getTotalDislikes()).isEqualTo(1);
        verify(characterRepository).save(character);
        verify(voteRepository).save(any(Vote.class));
    }

    @Test
    void getRecentVotes_shouldReturnVotes_whenVotesExist() {
        // Given
        Character character = createCharacter();
        Vote vote1 = createVote(character, "like");
        Vote vote2 = createVote(character, "dislike");
        List<Vote> votes = List.of(vote1, vote2);

        when(voteRepository.findByOrderByTimestampDesc(any(PageRequest.class)))
                .thenReturn(votes);

        // When
        List<VoteResponseDTO> result = voteService.getRecentVotes(10);

        // Then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getVoteType()).isEqualTo("like");
        assertThat(result.get(1).getVoteType()).isEqualTo("dislike");
    }

    @Test
    void getLastEvaluated_shouldReturnLastVote_whenVotesExist() {
        // Given
        Character character = createCharacter();
        Vote lastVote = createVote(character, "like");

        when(voteRepository.findTopByOrderByTimestampDesc()).thenReturn(lastVote);

        // When
        VoteResponseDTO result = voteService.getLastEvaluated();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getCharacterName()).isEqualTo("Pikachu");
        assertThat(result.getVoteType()).isEqualTo("like");
    }

    @Test
    void getLastEvaluated_shouldReturnNull_whenNoVotesExist() {
        // Given
        when(voteRepository.findTopByOrderByTimestampDesc()).thenReturn(null);

        // When
        VoteResponseDTO result = voteService.getLastEvaluated();

        // Then
        assertThat(result).isNull();
    }

    private VoteRequestDTO createVoteRequest(String voteType) {
        VoteRequestDTO request = new VoteRequestDTO();
        request.setCharacterId("1");
        request.setCharacterName("Pikachu");
        request.setCharacterSource("pokemon");
        request.setImageUrl("http://example.com/image.png");
        request.setDescription("Electric Pokemon");
        request.setVoteType(voteType);
        return request;
    }

    private Character createCharacter() {
        Character character = new Character();
        character.setId("1");
        character.setName("Pikachu");
        character.setSource("pokemon");
        character.setImageUrl("http://example.com/image.png");
        character.setDescription("Electric Pokemon");
        character.setTotalLikes(0);
        character.setTotalDislikes(0);
        character.setTotalVotes(0);
        return character;
    }

    private Vote createVote(Character character, String voteType) {
        Vote vote = new Vote();
        vote.setId("vote1");
        vote.setCharacter(character);
        vote.setVoteType(voteType);
        vote.setTimestamp(LocalDateTime.now());
        return vote;
    }
}
