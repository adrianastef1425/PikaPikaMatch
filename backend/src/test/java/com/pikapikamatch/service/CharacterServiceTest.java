package com.pikapikamatch.service;

import com.pikapikamatch.exception.ResourceNotFoundException;
import com.pikapikamatch.model.dto.CharacterDTO;
import com.pikapikamatch.model.dto.CharacterStatsDTO;
import com.pikapikamatch.model.entity.Character;
import com.pikapikamatch.repository.CharacterRepository;
import com.pikapikamatch.service.external.PokeApiService;
import com.pikapikamatch.service.external.RickAndMortyApiService;
import com.pikapikamatch.service.external.SuperHeroApiService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CharacterServiceTest {

    @Mock
    private CharacterRepository characterRepository;

    @Mock
    private PokeApiService pokeApiService;

    @Mock
    private RickAndMortyApiService rickAndMortyApiService;

    @Mock
    private SuperHeroApiService superHeroApiService;

    @Mock
    private RetryService retryService;

    @InjectMocks
    private CharacterService characterService;

    @Test
    void getRandomCharacter_shouldReturnCharacter_whenApiSucceeds() {
        // Given
        CharacterDTO expectedCharacter = CharacterDTO.builder()
                .id("1")
                .name("Pikachu")
                .source("pokemon")
                .build();

        when(retryService.executeWithRetry(any(), anyString()))
                .thenReturn(expectedCharacter);

        // When
        CharacterDTO result = characterService.getRandomCharacter();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Pikachu");
        verify(retryService, atLeastOnce()).executeWithRetry(any(), anyString());
    }

    @Test
    void getCharacterByName_shouldReturnCharacter_whenExists() {
        // Given
        Character character = createCharacter("Pikachu", 10, 5);
        when(characterRepository.findByNameIgnoreCase("Pikachu"))
                .thenReturn(Optional.of(character));

        // When
        CharacterStatsDTO result = characterService.getCharacterByName("Pikachu");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Pikachu");
        assertThat(result.getTotalLikes()).isEqualTo(10);
        assertThat(result.getTotalDislikes()).isEqualTo(5);
    }

    @Test
    void getCharacterByName_shouldThrowException_whenNotFound() {
        // Given
        when(characterRepository.findByNameIgnoreCase("Unknown"))
                .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> characterService.getCharacterByName("Unknown"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Character not found: Unknown");
    }

    @Test
    void addLikesByName_shouldIncrementLikes_whenCharacterExists() {
        // Given
        Character character = createCharacter("Pikachu", 10, 5);
        when(characterRepository.findByNameIgnoreCase("Pikachu"))
                .thenReturn(Optional.of(character));
        when(characterRepository.save(any(Character.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        CharacterStatsDTO result = characterService.addLikesByName("Pikachu", 3);

        // Then
        assertThat(result.getTotalLikes()).isEqualTo(13);
        assertThat(result.getTotalVotes()).isEqualTo(18);
        verify(characterRepository).save(any(Character.class));
    }

    @Test
    void addLikesByName_shouldThrowException_whenCharacterNotFound() {
        // Given
        when(characterRepository.findByNameIgnoreCase("Unknown"))
                .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> characterService.addLikesByName("Unknown", 5))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void addDislikesByName_shouldIncrementDislikes_whenCharacterExists() {
        // Given
        Character character = createCharacter("Pikachu", 10, 5);
        when(characterRepository.findByNameIgnoreCase("Pikachu"))
                .thenReturn(Optional.of(character));
        when(characterRepository.save(any(Character.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        CharacterStatsDTO result = characterService.addDislikesByName("Pikachu", 2);

        // Then
        assertThat(result.getTotalDislikes()).isEqualTo(7);
        assertThat(result.getTotalVotes()).isEqualTo(17);
        verify(characterRepository).save(any(Character.class));
    }

    @Test
    void addDislikesByName_shouldThrowException_whenCharacterNotFound() {
        // Given
        when(characterRepository.findByNameIgnoreCase("Unknown"))
                .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> characterService.addDislikesByName("Unknown", 3))
                .isInstanceOf(ResourceNotFoundException.class);
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
