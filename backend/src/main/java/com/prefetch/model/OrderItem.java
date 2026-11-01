package com.prefetch.model;

public class OrderItem {
    private String itemId;
    private String name;
    private int qty;
    private double price;

    public OrderItem() {}

    public OrderItem(String itemId, String name, int qty, double price) {
        this.itemId = itemId;
        this.name = name;
        this.qty = qty;
        this.price = price;
    }

    // Getters and setters
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
