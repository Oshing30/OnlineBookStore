package com.demo.onlineBookStore.service;

import com.demo.onlineBookStore.dto.OrderRequest;
import com.demo.onlineBookStore.dto.OrderResponse;
import com.demo.onlineBookStore.entity.Book;
import com.demo.onlineBookStore.entity.Order;
import com.demo.onlineBookStore.entity.OrderItem;
import com.demo.onlineBookStore.exception.InsufficientStockException;
import com.demo.onlineBookStore.exception.ResourceNotFoundException;
import com.demo.onlineBookStore.repository.BookRepository;
import com.demo.onlineBookStore.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;

    public OrderService(BookRepository bookRepository, OrderRepository orderRepository) {
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
    }

    // @Transactional: checkout is multi-step (validate stock, snapshot prices,
    // decrement stock, persist). It must all succeed or all roll back.
    @Transactional
    public OrderResponse checkout(OrderRequest request) {
        Order order = new Order();
        order.setOrderDate(Instant.now());

        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.Item item : request.getItems()) {
            Book book = bookRepository.findById(item.getBookId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Book not found with id " + item.getBookId()));

            if (book.getStockQuantity() < item.getQuantity()) {
                throw new InsufficientStockException(
                        "Not enough stock for '" + book.getTitle() + "'. Available: "
                                + book.getStockQuantity() + ", requested: " + item.getQuantity());
            }

            // Snapshot the price NOW so later price changes don't alter history.
            OrderItem orderItem = new OrderItem(
                    book.getId(), book.getTitle(), book.getPrice(), item.getQuantity());
            order.addItem(orderItem);

            // Decrement stock.
            book.setStockQuantity(book.getStockQuantity() - item.getQuantity());

            total = total.add(book.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        return toResponse(saved);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.LineItem> lines = new ArrayList<>();
        for (OrderItem oi : order.getItems()) {
            BigDecimal lineTotal = oi.getPriceAtPurchase()
                    .multiply(BigDecimal.valueOf(oi.getQuantity()));
            lines.add(new OrderResponse.LineItem(
                    oi.getBookId(), oi.getBookTitle(), oi.getPriceAtPurchase(),
                    oi.getQuantity(), lineTotal));
        }
        return new OrderResponse(order.getId(), order.getOrderDate(),
                order.getTotalAmount(), lines);
    }
}
