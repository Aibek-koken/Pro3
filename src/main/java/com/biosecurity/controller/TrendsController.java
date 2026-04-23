package com.biosecurity.controller;

import com.biosecurity.service.MlApiService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trends")
public class TrendsController {

    private final MlApiService mlApiService;

    public TrendsController(MlApiService mlApiService) {
        this.mlApiService = mlApiService;
    }

    @GetMapping("/{country}")
    public ResponseEntity<JsonNode> getTrends(
            @PathVariable String country,
            @RequestParam(defaultValue = "6") int months
    ) {
        return mlApiService.getTrends(country, months);
    }
}
