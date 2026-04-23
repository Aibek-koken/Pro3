package com.biosecurity.service;

import com.biosecurity.dto.RiskUserRequest;
import com.biosecurity.entity.RiskCheck;
import com.biosecurity.repository.RiskCheckRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Service
public class RiskHistoryService {

    private static final Logger log = LoggerFactory.getLogger(RiskHistoryService.class);

    private final RiskCheckRepository riskCheckRepository;

    public RiskHistoryService(RiskCheckRepository riskCheckRepository) {
        this.riskCheckRepository = riskCheckRepository;
    }

    public void saveCheck(RiskUserRequest request, JsonNode response) {
        try {
            RiskCheck riskCheck = new RiskCheck();
            riskCheck.setCountry(request.country());
            riskCheck.setCheckDate(parseDate(request.date()));
            riskCheck.setFever(request.safeFever());
            riskCheck.setCough(request.safeCough());
            riskCheck.setFatigue(request.safeFatigue());
            riskCheck.setBreathingIssues(request.safeBreathingIssues());
            riskCheck.setHeadache(request.safeHeadache());
            riskCheck.setBodyAches(request.safeBodyAches());

            if (response != null && response.hasNonNull("user_risk_score")) {
                riskCheck.setUserRiskScore((float) response.path("user_risk_score").asDouble());
            }
            if (response != null && response.hasNonNull("risk_level")) {
                riskCheck.setRiskLevel(response.path("risk_level").asText());
            }

            riskCheckRepository.save(riskCheck);
        } catch (Exception exception) {
            log.warn("Failed to persist risk check for country {}", request.country(), exception);
        }
    }

    private LocalDate parseDate(String value) {
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException exception) {
            return LocalDate.now();
        }
    }
}
