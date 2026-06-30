package com.demo.onlineBookStore.dto;

public record AuthResponse(String token, String username, String email) {
}
