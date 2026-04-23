package com.biosecurity.service;

import com.biosecurity.config.MlApiConfig;
import com.biosecurity.dto.RiskCountryRequest;
import com.biosecurity.dto.RiskUserRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_GATEWAY;

@Service
public class MlApiService {

    private final RestTemplate restTemplate;
    private final MlApiConfig mlApiConfig;
    private final ObjectMapper objectMapper;

    public MlApiService(RestTemplate restTemplate, MlApiConfig mlApiConfig, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.mlApiConfig = mlApiConfig;
        this.objectMapper = objectMapper;
    }

    public ResponseEntity<JsonNode> getCountries() {
        URI uri = UriComponentsBuilder.fromHttpUrl(mlApiConfig.getBaseUrl())
                .path("/countries")
                .build()
                .toUri();
        return exchangeJson(uri, HttpMethod.GET, null);
    }

    public ResponseEntity<JsonNode> getCountryRisk(RiskCountryRequest request) {
        URI uri = UriComponentsBuilder.fromHttpUrl(mlApiConfig.getBaseUrl())
                .path("/risk/country")
                .build()
                .toUri();
        return exchangeJson(uri, HttpMethod.POST, request);
    }

    public ResponseEntity<JsonNode> getUserRisk(RiskUserRequest request) {
        URI uri = UriComponentsBuilder.fromHttpUrl(mlApiConfig.getBaseUrl())
                .path("/risk/user")
                .build()
                .toUri();
        return exchangeJson(uri, HttpMethod.POST, request);
    }

    public ResponseEntity<JsonNode> getTrends(String country, int months) {
        URI uri = UriComponentsBuilder.fromHttpUrl(mlApiConfig.getBaseUrl())
                .pathSegment("trends", country)
                .queryParam("months", months)
                .build()
                .toUri();
        return exchangeJson(uri, HttpMethod.GET, null);
    }

    private ResponseEntity<JsonNode> exchangeJson(URI uri, HttpMethod method, Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<?> entity = new HttpEntity<>(body, headers);

        try {
            return restTemplate.exchange(uri, method, entity, JsonNode.class);
        } catch (HttpStatusCodeException exception) {
            return ResponseEntity.status(exception.getStatusCode())
                    .body(parseErrorBody(exception));
        } catch (RestClientException exception) {
            throw new ResponseStatusException(BAD_GATEWAY, "ML API request failed", exception);
        }
    }

    private JsonNode parseErrorBody(HttpStatusCodeException exception) {
        byte[] body = exception.getResponseBodyAsByteArray();
        if (body == null || body.length == 0) {
            return objectMapper.valueToTree(Map.of("error", exception.getStatusText()));
        }

        try {
            return objectMapper.readTree(body);
        } catch (IOException parseException) {
            return objectMapper.valueToTree(Map.of("error", exception.getResponseBodyAsString()));
        }
    }
}
