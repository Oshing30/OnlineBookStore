package com.demo.onlineBookStore.controller;

import com.demo.onlineBookStore.dto.OrderRequest;
import com.demo.onlineBookStore.dto.OrderResponse;
import com.demo.onlineBookStore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // POST /api/orders -> 201 Created with the order summary.
    // @Valid triggers bean validation; failures map to 400.
    @PostMapping
    public ResponseEntity<OrderResponse> checkout(@Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.checkout(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
