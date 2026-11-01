package com.prefetch.model;

import java.time.Instant;

public class User {
    private String id;
    private String username;
    private String email;
    private String department;
    private String role;       // STUDENT, STAFF, ADMIN
    private String status;     // ACTIVE, PENDING, IDLE
    private Instant createdAt;

    public User() {}

    public User(String id, String username, String email, String department, String role, String status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.department = department;
        this.role = role;
        this.status = status;
        this.createdAt = Instant.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
