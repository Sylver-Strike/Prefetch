package com.prefetch.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    // TODO: Inject CatalogService backed by Firestore

    @GetMapping
    public ResponseEntity<?> getCatalog(
            @RequestParam(required = false) String dept,
            @RequestParam(required = false) String category) {

        // Demo data — will be replaced with Firestore queries
        List<Map<String, Object>> items = List.of(
                Map.of("item_id", "CS301-BK", "name", "Data Structures & Algorithms Lab Manual",
                        "category", "Textbooks", "department", "Computer Science",
                        "stock", 14, "price", 260.0, "is_active", true),
                Map.of("item_id", "CS-APRN-M", "name", "CSE Department Lab Apron",
                        "category", "Uniforms", "department", "Computer Science",
                        "stock", 22, "price", 320.0, "is_active", true),
                Map.of("item_id", "MECH-DRW-KIT", "name", "Engineering Drawing Precision Kit",
                        "category", "Academic Kits", "department", "Mechanical",
                        "stock", 3, "price", 580.0, "is_active", true)
        );

        return ResponseEntity.ok(Map.of("items", items, "total", items.size()));
    }

    @GetMapping("/{itemId}/stock")
    public ResponseEntity<?> getStock(@PathVariable String itemId) {
        // TODO: Real-time Firestore read
        return ResponseEntity.ok(Map.of("item_id", itemId, "stock", 14));
    }
}
