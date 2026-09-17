package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.MetricPointDto;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.MetricService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clients/{clientId}/metrics")
@RequiredArgsConstructor
public class MetricController {

  private final MetricService metricService;

  @GetMapping
  public List<MetricPointDto> query(
      @PathVariable Long clientId,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
      Principal principal) {
    return metricService.query(clientId, from, to, principal.getName());
  }

  /** Bulk ingest — used by manual entry, CSV import, and the push API. */
  @PostMapping
  public Map<String, Integer> ingest(
      @PathVariable Long clientId,
      @Valid @RequestBody List<MetricPointDto> points,
      Principal principal) {
    int count = metricService.ingest(clientId, points, principal.getName());
    return Map.of("ingested", count);
  }
}
