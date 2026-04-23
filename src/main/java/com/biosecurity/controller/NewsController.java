package com.biosecurity.controller;

import com.biosecurity.dto.NewsResponse;
import com.biosecurity.service.NewsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/{country}")
    public NewsResponse getNews(@PathVariable String country) {
        return newsService.getNews(country);
    }
}
