package com.pikapikamatch.controller;

import com.pikapikamatch.exception.ResourceNotFoundException;
import com.pikapikamatch.model.dto.CharacterDTO;
import com.pikapikamatch.model.dto.CharacterStatsDTO;
import com.pikapikamatch.model.dto.UpdateVoteCountDTO;
import com.pikapikamatch.service.CharacterService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CharacterControllerTest {

    @Mock
    private CharacterService characterService;

    @InjectMocks
    private CharacterController characterController;

    @Test
    void getRandomCharacter_shouldReturnCharacter_whenServiceSucceeds() {
        // Given
        CharacterDTO character = CharacterDTO.builder()
                .id("1")
                .name("Pikachu")
                .source("pokemon")
                .build();
        when(characterService.getRandomCharacter()).thenReturn(character);

        // When
        var response = characterController.getRandomCharacter();

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getData().getName()).isEqualTo("Pikachu");
        verify(characterService).getRandomCharacter();
    }

    @Test
    void getCharacterByName_shouldReturnCharacter_whenExists() {
        // Given
        CharacterStatsDTO stats = createCharacterStats("Pikachu", 10, 5);
        when(characterService.getCharacterByName("Pikachu")).thenReturn(stats);

        // When
        var response = characterController.getCharacterByName("Pikachu");

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getData().getName()).isEqualTo("Pikachu");
    }

    @Test
    void getCharacterByName_shouldThrowException_whenNotFound() {
        // Given
        when(characterService.getCharacterByName("Unknown"))
                .thenThrow(new ResourceNotFoundException("Character not found: Unknown"));

        // When/Then
        assertThatThrownBy(() -> characterController.getCharacterByName("Unknown"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void addLikes_shouldReturnUpdatedStats_whenSuccessful() {
        // Given
        UpdateVoteCountDTO request = new UpdateVoteCountDTO(5);
        CharacterStatsDTO stats = createCharacterStats("Pikachu", 15, 5);
        when(characterService.addLikesByName("Pikachu", 5)).thenReturn(stats);

        // When
        var response = characterController.addLikes("Pikachu", request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getData().getTotalLikes()).isEqualTo(15);
        verify(characterService).addLikesByName("Pikachu", 5);
    }

    @Test
    void addDislikes_shouldReturnUpdatedStats_whenSuccessful() {
        // Given
        UpdateVoteCountDTO request = new UpdateVoteCountDTO(3);
        CharacterStatsDTO stats = createCharacterStats("Pikachu", 10, 8);
        when(characterService.addDislikesByName("Pikachu", 3)).thenReturn(stats);

        // When
        var response = characterController.addDislikes("Pikachu", request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getData().getTotalDislikes()).isEqualTo(8);
        verify(characterService).addDislikesByName("Pikachu", 3);
    }

    private CharacterStatsDTO createCharacterStats(String name, int likes, int dislikes) {
        return CharacterStatsDTO.builder()
                .id("1")
                .name(name)
                .source("pokemon")
                .totalLikes(likes)
                .totalDislikes(dislikes)
                .totalVotes(likes + dislikes)
                .likePercentage((double) likes / (likes + dislikes) * 100)
                .dislikePercentage((double) dislikes / (likes + dislikes) * 100)
                .build();
    }
}
