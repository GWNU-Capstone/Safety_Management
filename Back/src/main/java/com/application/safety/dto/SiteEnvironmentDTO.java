package com.application.safety.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

public class SiteEnvironmentDTO {

    @Getter
    @Setter
    @ToString
    public static class Request {
        private float temperature;
        private float humidity;
        private float fineDust;
        private float sunshine;
    }

    @Getter
    @Setter
    public static class Response {
        private Long dataOrder; // 데이터 순번
        private Data data;

        @Setter
        @Getter
        public static class Data {
            private float temperature;
            private float humidity;
            private float fineDust;
            private float sunshine;
        }
    }
}