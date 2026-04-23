package com.biosecurity.dto;

import java.util.List;

public record NewsResponse(
        List<NewsArticle> articles,
        String source_type
) {
}
