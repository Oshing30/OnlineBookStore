package com.demo.onlineBookStore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

// The frontend holds the cart in React state and sends the whole thing
// at checkout. Validation annotations are enforced by @Valid in the controller.
public class OrderRequest {

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<Item> items;

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public static class Item {

        @NotNull(message = "bookId is required")
        private Long bookId;

        @Min(value = 1, message = "quantity must be at least 1")
        private int quantity;

        public Long getBookId() {
            return bookId;
        }

        public void setBookId(Long bookId) {
            this.bookId = bookId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}
