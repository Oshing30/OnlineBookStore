package com.demo.onlineBookStore.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long orderId,
        Instant orderDate,
        BigDecimal totalAmount,
        List<LineItem> items) {

    public record LineItem(
            Long bookId,
            String title,
            BigDecimal unitPrice,
            int quantity,
            BigDecimal lineTotal) {
    }
}
