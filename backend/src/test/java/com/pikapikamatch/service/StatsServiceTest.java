package com.pikapikamatch.service;

import com.pikapikamatch.exception.ExternalApiException;
import com.pikapikamatch.model.dto.CharacterStatsDTO;
import com.pikapikamatch.model.entity.Character;
import com.pikapikamatch.repository.CharacterRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    @Mock
    private CharacterRepository characterRepository;

    @InjectMocks
    private StatsService statsService;

    @Test
    void getMostLiked_shouldReturnCharacter_whenCharactersExist() {
        // Given
        Character character = createCharacter("Pikachu", 100, 10);
        when(characterRepository.findTopByOrderByTotalLikesDesc()).thenReturn(character);

        // When
        CharacterStatsDTO result = statsService.getMostLiked();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Pikachu");
        assertThat(result.getTotalLikes()).isEqualTo(100);
    }

    @Test
    void getMostLiked_shouldThrowException_whenNoCharactersExist() {
        // Given
        when(characterRepository.findTopByOrderByTotalLikesDesc()).thenReturn(null);

        // When/Then
        assertThatThrownBy(() -> statsService.getMostLiked())
                .isInstanceOf(ExternalApiException.class)
                .hasMessageContaining("No characters available");
    }

    @Test
    void getMostDisliked_shouldReturnCharacter_whenCharactersExist() {
        // Given
        Character character = createCharacter("Meowth", 10, 100);
        when(characterRepository.findTopByOrderByTotalDislikesDesc()).thenReturn(character);

        // When
        CharacterStatsDTO result = statsService.getMostDisliked();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Meowth");
        assertThat(result.getTotalDislikes()).isEqualTo(100);
    }

    @Test
    void getMostDisliked_shouldThrowException_whenNoCharactersExist() {
        // Given
        when(characterRepository.findTopByOrderByTotalDislikesDesc()).thenReturn(null);

        // When/Then
        assertThatThrownBy(() -> statsService.getMostDisliked())
                .isInstanceOf(ExternalApiException.class)
                .hasMessageContaining("No characters available");
    }

    @Test
    void getTopLiked_shouldReturnList_whenCharactersExist() {
        // Given
        List<Character> characters = List.of(
                createCharacter("Pikachu", 100, 10),
                createCharacter("Charizard", 90, 15),
                createCharacter("Bulbasaur", 80, 20)
        );
        when(characterRepository.findByOrderByTotalLikesDesc(any(PageRequest.class)))
                .thenReturn(characters);

        // When
        List<CharacterStatsDTO> result = statsService.getTopLiked(3);

        // Then
        assertThat(result).hasSize(3);
        assertThat(result.get(0).getName()).isEqualTo("Pikachu");
        assertThat(result.get(0).getTotalLikes()).isEqualTo(100);
        assertThat(result.get(1).getTotalLikes()).isEqualTo(90);
        assertThat(result.get(2).getTotalLikes()).isEqualTo(80);
    }

    @Test
    void getTopDisliked_shouldReturnList_whenCharactersExist() {
        // Given
        List<Character> characters = List.of(
                createCharacter("Meowth", 10, 100),
                createCharacter("Zubat", 15, 90),
                createCharacter("Rattata", 20, 80)
        );
        when(characterRepository.findByOrderByTotalDislikesDesc(any(PageRequest.class)))
                .thenReturn(characters);

        // When
        List<CharacterStatsDTO> result = statsService.getTopDisliked(3);

        // Then
        assertThat(result).hasSize(3);
        assertThat(result.get(0).getName()).isEqualTo("Meowth");
        assertThat(result.get(0).getTotalDislikes()).isEqualTo(100);
        assertThat(result.get(1).getTotalDislikes()).isEqualTo(90);
        assertThat(result.get(2).getTotalDislikes()).isEqualTo(80);
    }

    private Character createCharacter(String name, int likes, int dislikes) {
        Character character = new Character();
        character.setId("1");
        character.setName(name);
        character.setSource("pokemon");
        character.setImageUrl("http://example.com/image.png");
        character.setDescription("Test character");
        character.setTotalLikes(likes);
        character.setTotalDislikes(dislikes);
        character.setTotalVotes(likes + dislikes);
        return character;
    }
}
