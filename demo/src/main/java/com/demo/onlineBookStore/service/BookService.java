package com.demo.onlineBookStore.service;

import com.demo.onlineBookStore.dto.BookDto;
import com.demo.onlineBookStore.entity.Book;
import com.demo.onlineBookStore.exception.ResourceNotFoundException;
import com.demo.onlineBookStore.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
        return toDto(book);
    }

    private BookDto toDto(Book book) {
        return new BookDto(book.getId(), book.getTitle(), book.getAuthor(),
                book.getPrice(), book.getStockQuantity());
    }
}
