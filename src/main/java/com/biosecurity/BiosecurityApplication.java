package com.biosecurity;

import com.biosecurity.config.MlApiConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(MlApiConfig.class)
public class BiosecurityApplication {

    public static void main(String[] args) {
        SpringApplication.run(BiosecurityApplication.class, args);
    }
}
