package com.pikapikamatch.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestTemplateConfig {

    @Value("${external.apis.superhero.api-key:}")
    private String superheroApiKey;

    @Bean
    public RestTemplate pokeApiRestTemplate(RestTemplateBuilder builder) {
        return builder
                .rootUri("https://pokeapi.co/api/v2")
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Bean
    public RestTemplate rickAndMortyRestTemplate(RestTemplateBuilder builder) {
        return builder
                .rootUri("https://rickandmortyapi.com/api")
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Bean
    public RestTemplate superheroRestTemplate(RestTemplateBuilder builder) {
        String baseUrl = "https://superheroapi.com/api";
        if (superheroApiKey != null && !superheroApiKey.isEmpty()) {
            baseUrl = baseUrl + "/" + superheroApiKey;
        }
        
        return builder
                .rootUri(baseUrl)
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }
}
