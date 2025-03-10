package com.example.roadmllm;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 对所有接口都应用跨域配置
                        .allowedOrigins("*") // 允许任何域进行跨域访问
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // 允许的请求方法
                        .allowedHeaders("*") ;// 允许的请求头
//                        .allowCredentials(true); // 是否允许携带认证信息
            }
        };
    }
}