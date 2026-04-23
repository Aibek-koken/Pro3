package com.biosecurity.controller;

import com.biosecurity.dto.RiskCountryRequest;
import com.biosecurity.dto.RiskUserRequest;
import com.biosecurity.service.MlApiService;
import com.biosecurity.service.RiskHistoryService;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RiskController {

    private final MlApiService mlApiService;
    private final RiskHistoryService riskHistoryService;

    public RiskController(MlApiService mlApiService, RiskHistoryService riskHistoryService) {
        this.mlApiService = mlApiService;
        this.riskHistoryService = riskHistoryService;
    }

    @GetMapping("/countries")
    public ResponseEntity<JsonNode> getCountries() {
        return mlApiService.getCountries();
    }

    @PostMapping("/risk/country")
    public ResponseEntity<JsonNode> getCountryRisk(@Valid @RequestBody RiskCountryRequest request) {
        return mlApiService.getCountryRisk(request);
    }

    @PostMapping("/risk/user")
    public ResponseEntity<JsonNode> getUserRisk(@Valid @RequestBody RiskUserRequest request) {
        ResponseEntity<JsonNode> response = mlApiService.getUserRisk(request);
        if (response.getStatusCode().is2xxSuccessful()) {
            riskHistoryService.saveCheck(request, response.getBody());
        }
        return response;
    }
}
