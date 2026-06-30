package com.demo.onlineBookStore.dto;

import java.math.BigDecimal;

// Response DTO. We never expose the JPA entity directly across the
// controller boundary (avoids schema leakage + lazy-loading issues).
public record BookDto(Long id, String title, String author, BigDecimal price, int stockQuantity) {
}
