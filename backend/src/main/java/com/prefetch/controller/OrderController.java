package com.prefetch.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Value("${upi.payee-vpa}")
    private String payeeVpa;

    @Value("${upi.payee-name}")
    private String payeeName;

    // TODO: Inject OrderService with db.runTransaction() for atomic checkout

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> request) {
        // CRITICAL: This must use db.runTransaction() in production
        // See OrderService.checkout() in the implementation plan

        String orderId = "PF-" + ThreadLocalRandom.current().nextInt(1000, 9999);
        String tokenCode = orderId;
        String pin = String.valueOf(ThreadLocalRandom.current().nextInt(1000, 9999));

        // Generate UPI deep-link
        double totalAmount = ((Number) request.getOrDefault("total", 0)).doubleValue();
        String upiLink = String.format(
                "upi://pay?pa=%s&pn=%s&am=%.2f&cu=INR&tn=Order-%s",
                payeeVpa, payeeName, totalAmount, orderId
        );

        return ResponseEntity.ok(Map.of(
                "order_id", orderId,
                "token_code", tokenCode,
                "dispatch_location", "DISP-B4",
                "pin", pin,
                "upi_link", upiLink,
                "status", "PENDING",
                "created_at", Instant.now().toString()
        ));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable String orderId) {
        // TODO: Firestore lookup
        return ResponseEntity.ok(Map.of(
                "order_id", orderId,
                "status", "PAID",
                "total_amount", 580.0
        ));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String orderId,
                                          @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        // TODO: Update in Firestore
        return ResponseEntity.ok(Map.of(
                "order_id", orderId,
                "status", newStatus,
                "updated_at", Instant.now().toString()
        ));
    }
}
