package com.prefetch.controller;

import com.prefetch.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtTokenProvider tokenProvider;

    public AuthController(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.getOrDefault("email", "");
        String role = request.getOrDefault("role", "STUDENT").toUpperCase();

        // TODO: Replace with Firestore user lookup and password verification
        // For now, generate a JWT for the provided credentials
        String userId = UUID.randomUUID().toString();
        String username = email.contains("@") ? email.split("@")[0] : email;
        String department = determineDepartment(email);

        String token = tokenProvider.generateToken(userId, username, email, role, department);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "userId", userId,
                        "username", username,
                        "email", email,
                        "role", role,
                        "department", department
                )
        ));
    }

    private String determineDepartment(String email) {
        if (email.toLowerCase().startsWith("cs")) return "Computer Science";
        if (email.toLowerCase().startsWith("me")) return "Mechanical";
        if (email.toLowerCase().startsWith("ec")) return "Electronics";
        if (email.toLowerCase().startsWith("bt")) return "Biotechnology";
        return "General";
    }
}
