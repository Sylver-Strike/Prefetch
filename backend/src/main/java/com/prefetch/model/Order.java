package com.prefetch.model;

import java.time.Instant;
import java.util.List;

public class Order {
    private String orderId;
    private String userId;
    private String status;      // PENDING, PAID, COLLECTED
    private double totalAmount;
    private List<OrderItem> items;
    private String tokenCode;
    private String dispatchLocation;
    private String upiRef;
    private Instant createdAt;

    public Order() {}

    // Getters and setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public String getTokenCode() { return tokenCode; }
    public void setTokenCode(String tokenCode) { this.tokenCode = tokenCode; }
    public String getDispatchLocation() { return dispatchLocation; }
    public void setDispatchLocation(String dispatchLocation) { this.dispatchLocation = dispatchLocation; }
    public String getUpiRef() { return upiRef; }
    public void setUpiRef(String upiRef) { this.upiRef = upiRef; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
