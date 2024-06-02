package com.application.safety.dto.chatgpt;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

public class ChatGPT {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private List<Choice> choices;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Choice {
            private int index;
            private Message message;
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Request {
        private String model;
        private List<Message> messages;

        public Request(String model, String contents) {
            this.model = model;
            this.messages = new ArrayList<>();
            this.messages.add(new Message("user", contents));
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}