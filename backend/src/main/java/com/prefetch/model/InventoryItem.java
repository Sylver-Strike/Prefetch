package com.prefetch.model;

import java.util.List;
import java.util.Map;

public class InventoryItem {
    private String itemId;
    private String name;
    private String category;
    private String department;
    private int stock;
    private double price;
    private boolean isActive;
    private String imageUrl;
    private List<Map<String, Object>> variants;
    private int lowThreshold;

    public InventoryItem() {}

    // Getters and setters
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<Map<String, Object>> getVariants() { return variants; }
    public void setVariants(List<Map<String, Object>> variants) { this.variants = variants; }
    public int getLowThreshold() { return lowThreshold; }
    public void setLowThreshold(int lowThreshold) { this.lowThreshold = lowThreshold; }
}
