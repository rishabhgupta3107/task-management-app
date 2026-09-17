package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.MetricPointDto;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.MetricService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Token-authenticated metric ingestion. The per-client ingest token IS the credential, so this is outside the JWT-protected area (permitted in SecurityConfig).
 */
@RestController
@RequestMapping("/api/ingest")
@RequiredArgsConstructor
public class IngestController {

  private final MetricService metricService;

  @PostMapping("/{token}")
  public Map<String, Integer> ingest(
      @PathVariable String token, @RequestBody List<MetricPointDto> points) {
    return Map.of("ingested", metricService.ingestByToken(token, points));
  }
}
