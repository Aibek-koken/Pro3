package com.biosecurity.dto;

import jakarta.validation.constraints.NotBlank;

public record RiskCountryRequest(
        @NotBlank String country,
        @NotBlank String date
) {
}
