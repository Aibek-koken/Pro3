package com.biosecurity.service;

import com.biosecurity.dto.NewsArticle;
import com.biosecurity.dto.NewsResponse;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NewsService {

    private static final Duration CACHE_TTL = Duration.ofMinutes(30);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final List<NewsArticle> STATIC_ALERTS = List.of(
            new NewsArticle("WHO: Mpox global health emergency update", "https://www.who.int/news/item/mpox", "WHO", "2026-04-01"),
            new NewsArticle("WHO: COVID-19 pandemic preparedness report", "https://www.who.int/news/item/covid-overview", "WHO", "2026-03-15"),
            new NewsArticle("WHO: Global influenza surveillance bulletin", "https://www.who.int/news/item/influenza", "WHO", "2026-03-01"),
            new NewsArticle("CDC: Infectious disease travel notices", "https://wwwnc.cdc.gov/travel/notices", "CDC", "2026-02-20"),
            new NewsArticle("ECDC: Communicable disease threats report", "https://www.ecdc.europa.eu/en/threats-and-outbreaks", "ECDC", "2026-02-10")
    );

    private final RestTemplate restTemplate;
    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public NewsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public NewsResponse getNews(String country) {
        String cacheKey = country.trim().toLowerCase();
        CacheEntry cached = cache.get(cacheKey);
        if (cached != null && cached.expiresAt().isAfter(Instant.now())) {
            return cached.response();
        }

        NewsResponse response = fetchRssNews(country)
                .orElseGet(this::fallbackResponse);

        cache.put(cacheKey, new CacheEntry(response, Instant.now().plus(CACHE_TTL)));
        return response;
    }

    private java.util.Optional<NewsResponse> fetchRssNews(String country) {
        List<RssSource> sources = List.of(
                new RssSource(buildGoogleNewsUrl(country), "Google News"),
                new RssSource("https://feeds.reuters.com/reuters/healthNews", "Reuters")
        );

        for (RssSource source : sources) {
            try {
                List<NewsArticle> articles = parseFeed(source.url(), source.name());
                if (!articles.isEmpty()) {
                    return java.util.Optional.of(new NewsResponse(articles, "rss"));
                }
            } catch (Exception ignored) {
                // Fall through to the next RSS source or static alerts.
            }
        }

        return java.util.Optional.empty();
    }

    private String buildGoogleNewsUrl(String country) {
        return UriComponentsBuilder.fromHttpUrl("https://news.google.com/rss/search")
                .queryParam("q", country + " health outbreak")
                .queryParam("hl", "en")
                .queryParam("gl", "US")
                .queryParam("ceid", "US:en")
                .build()
                .toUriString();
    }

    private List<NewsArticle> parseFeed(String url, String sourceName) throws Exception {
        String xml = restTemplate.getForObject(url, String.class);
        if (xml == null || xml.isBlank()) {
            return List.of();
        }

        try (XmlReader reader = new XmlReader(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)))) {
            SyndFeed feed = new SyndFeedInput().build(reader);
            return feed.getEntries().stream()
                    .limit(5)
                    .map(entry -> toArticle(entry, sourceName))
                    .filter(article -> article.url() != null && !article.url().isBlank())
                    .toList();
        } catch (RestClientException exception) {
            throw exception;
        }
    }

    private NewsArticle toArticle(SyndEntry entry, String sourceName) {
        LocalDate publishedAt = entry.getPublishedDate() != null
                ? entry.getPublishedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
                : entry.getUpdatedDate() != null
                ? entry.getUpdatedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
                : LocalDate.now();

        return new NewsArticle(
                entry.getTitle(),
                entry.getLink(),
                sourceName,
                DATE_FORMATTER.format(publishedAt)
        );
    }

    private NewsResponse fallbackResponse() {
        return new NewsResponse(STATIC_ALERTS, "static");
    }

    private record CacheEntry(NewsResponse response, Instant expiresAt) {
    }

    private record RssSource(String url, String name) {
    }
}
