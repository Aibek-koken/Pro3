import { api } from "./client";

export interface CountriesResponse {
  countries: string[];
}

export async function getCountries() {
  const response = await api.get<CountriesResponse>("/api/countries");
  return response.data;
}
