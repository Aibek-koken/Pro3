import { api } from "./client";
import type { RiskLevel } from "../utils/riskColor";

export interface UserRiskRequest {
  country: string;
  date: string;
  fever: number;
  cough: number;
  fatigue: number;
  breathing_issues: number;
  headache: number;
  body_aches: number;
}

export interface UserRiskResponse {
  user_risk_score: number;
  risk_level: RiskLevel;
  regional_risk: number;
  personal_score: number;
  recommendations: string[];
  dominant_disease?: string | null;
}

export interface CountryRiskRequest {
  country: string;
  date: string;
}

export interface CountryRiskBreakdown {
  classification: number;
  forecast_trend: number;
  anomaly_signal: number;
}

export interface CountryRiskForecast {
  "7d": number;
  "14d": number;
  "30d": number;
}

export interface CountryRiskResponse {
  risk_score: number;
  risk_level: RiskLevel;
  breakdown: CountryRiskBreakdown;
  forecast: CountryRiskForecast;
  current_cases: number;
  dominant_disease?: string | null;
}

export interface TrendPoint {
  date: string;
  cases_per_100k: number;
  cases_ma_30d: number;
}

export interface TrendsResponse {
  trend_direction: "Increasing" | "Decreasing" | "Stable" | string;
  change_pct: number;
  data: TrendPoint[];
}

export async function postUserRisk(payload: UserRiskRequest) {
  const response = await api.post<UserRiskResponse>("/api/risk/user", payload);
  return response.data;
}

export async function postCountryRisk(payload: CountryRiskRequest) {
  const response = await api.post<CountryRiskResponse>("/api/risk/country", payload);
  return response.data;
}

export async function getTrends(country: string, months = 6) {
  const response = await api.get<TrendsResponse>(`/api/trends/${encodeURIComponent(country)}`, {
    params: { months },
  });
  return response.data;
}
