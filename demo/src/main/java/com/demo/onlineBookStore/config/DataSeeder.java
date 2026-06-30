package com.demo.onlineBookStore.config;

import com.demo.onlineBookStore.entity.Book;
import com.demo.onlineBookStore.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

// Seeds the in-memory H2 database with sample books on startup,
// so GET /api/books returns data immediately.
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedBooks(BookRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Book("Clean Code", "Robert C. Martin", new BigDecimal("32.50"), 10));
                repo.save(new Book("Effective Java", "Joshua Bloch", new BigDecimal("45.00"), 8));
                repo.save(new Book("The Pragmatic Programmer", "Hunt & Thomas", new BigDecimal("38.99"), 5));
                repo.save(new Book("Refactoring", "Martin Fowler", new BigDecimal("49.99"), 6));
                repo.save(new Book("Design Patterns", "Gang of Four", new BigDecimal("41.25"), 4));
            }
        };
    }
}
