package com.demo.onlineBookStore.repository;

import com.demo.onlineBookStore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
