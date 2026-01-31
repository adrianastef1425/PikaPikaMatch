package com.pikapikamatch.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * MongoDB configuration class.
 * Enables MongoDB auditing for automatic timestamp management
 * and configures transaction support.
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {

    /**
     * Creates a MongoDB transaction manager bean.
     * Enables @Transactional support for MongoDB operations.
     *
     * @param dbFactory MongoDB database factory
     * @return MongoTransactionManager instance
     */
    @Bean
    public MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
        return new MongoTransactionManager(dbFactory);
    }
}
