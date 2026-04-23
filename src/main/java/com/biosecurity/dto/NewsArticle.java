package com.biosecurity.dto;

public record NewsArticle(
        String title,
        String url,
        String source,
        String published_at
) {
}
