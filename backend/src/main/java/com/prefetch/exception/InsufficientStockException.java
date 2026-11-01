package com.prefetch.exception;

public class InsufficientStockException extends RuntimeException {
    private final String itemId;

    public InsufficientStockException(String itemId) {
        super("Insufficient stock for item: " + itemId);
        this.itemId = itemId;
    }

    public String getItemId() {
        return itemId;
    }
}
