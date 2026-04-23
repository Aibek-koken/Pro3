package com.biosecurity.dto;

import jakarta.validation.constraints.NotBlank;

public record RiskUserRequest(
        @NotBlank String country,
        @NotBlank String date,
        Integer fever,
        Integer cough,
        Integer fatigue,
        Integer breathing_issues,
        Integer headache,
        Integer body_aches
) {
    public int safeFever() {
        return fever != null ? fever : 0;
    }

    public int safeCough() {
        return cough != null ? cough : 0;
    }

    public int safeFatigue() {
        return fatigue != null ? fatigue : 0;
    }

    public int safeBreathingIssues() {
        return breathing_issues != null ? breathing_issues : 0;
    }

    public int safeHeadache() {
        return headache != null ? headache : 0;
    }

    public int safeBodyAches() {
        return body_aches != null ? body_aches : 0;
    }
}
