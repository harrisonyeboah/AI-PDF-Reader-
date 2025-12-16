package com.pdfreader.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    private static final String AUDIO_OUTPUT_DIR = "audio/"; // same as in your controller

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Maps http://localhost:8080/audio/** to files in your AUDIO_OUTPUT_DIR
        registry.addResourceHandler("/audio/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/" + AUDIO_OUTPUT_DIR);
    }
}
