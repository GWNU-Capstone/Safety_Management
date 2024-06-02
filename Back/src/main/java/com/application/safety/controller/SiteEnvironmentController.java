package com.application.safety.controller;

import com.application.safety.dto.SiteEnvironmentDTO;
import com.application.safety.service.SiteEnvironmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/data")
@RequiredArgsConstructor
public class SiteEnvironmentController {
    private final SiteEnvironmentService siteEnvironmentService;

    @GetMapping
    public ResponseEntity<List<SiteEnvironmentDTO.Response>> getDate() {
        List<SiteEnvironmentDTO.Response> responses= siteEnvironmentService.getEnvironmentData();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<Void> addData(@RequestBody SiteEnvironmentDTO.Request dto) {
        siteEnvironmentService.addEnvironmentData(dto);
        return ResponseEntity.noContent().build();
    }
}
