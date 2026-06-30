package com.demo.onlineBookStore.repository;

import com.demo.onlineBookStore.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
