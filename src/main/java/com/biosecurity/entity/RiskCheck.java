package com.biosecurity.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_checks")
public class RiskCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(name = "check_date", nullable = false)
    private LocalDate checkDate;

    private Integer fever;
    private Integer cough;
    private Integer fatigue;

    @Column(name = "breathing_issues")
    private Integer breathingIssues;

    private Integer headache;

    @Column(name = "body_aches")
    private Integer bodyAches;

    @Column(name = "user_risk_score")
    private Float userRiskScore;

    @Column(name = "risk_level", length = 10)
    private String riskLevel;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public LocalDate getCheckDate() {
        return checkDate;
    }

    public void setCheckDate(LocalDate checkDate) {
        this.checkDate = checkDate;
    }

    public Integer getFever() {
        return fever;
    }

    public void setFever(Integer fever) {
        this.fever = fever;
    }

    public Integer getCough() {
        return cough;
    }

    public void setCough(Integer cough) {
        this.cough = cough;
    }

    public Integer getFatigue() {
        return fatigue;
    }

    public void setFatigue(Integer fatigue) {
        this.fatigue = fatigue;
    }

    public Integer getBreathingIssues() {
        return breathingIssues;
    }

    public void setBreathingIssues(Integer breathingIssues) {
        this.breathingIssues = breathingIssues;
    }

    public Integer getHeadache() {
        return headache;
    }

    public void setHeadache(Integer headache) {
        this.headache = headache;
    }

    public Integer getBodyAches() {
        return bodyAches;
    }

    public void setBodyAches(Integer bodyAches) {
        this.bodyAches = bodyAches;
    }

    public Float getUserRiskScore() {
        return userRiskScore;
    }

    public void setUserRiskScore(Float userRiskScore) {
        this.userRiskScore = userRiskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
