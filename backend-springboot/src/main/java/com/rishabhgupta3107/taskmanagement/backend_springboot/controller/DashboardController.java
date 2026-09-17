package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.CreateDashboardRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.DashboardResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.DashboardSummary;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.ScheduleRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.WidgetDto;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.DashboardService;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.ReportService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

  private final DashboardService dashboardService;
  private final ReportService reportService;

  @GetMapping("/clients/{clientId}/dashboards")
  public List<DashboardSummary> list(@PathVariable Long clientId, Principal principal) {
    return dashboardService.listForClient(clientId, principal.getName());
  }

  @PostMapping("/clients/{clientId}/dashboards")
  public ResponseEntity<DashboardResponse> create(
      @PathVariable Long clientId,
      @Valid @RequestBody CreateDashboardRequest request,
      Principal principal) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(dashboardService.create(clientId, request, principal.getName()));
  }

  @GetMapping("/dashboards/{id}")
  public DashboardResponse get(@PathVariable Long id, Principal principal) {
    return dashboardService.get(id, principal.getName());
  }

  @DeleteMapping("/dashboards/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
    dashboardService.delete(id, principal.getName());
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/dashboards/{id}/widgets")
  public WidgetDto addWidget(
      @PathVariable Long id, @Valid @RequestBody WidgetDto widget, Principal principal) {
    return dashboardService.addWidget(id, widget, principal.getName());
  }

  @PutMapping("/dashboards/{id}/widgets/{widgetId}")
  public WidgetDto updateWidget(
      @PathVariable Long id,
      @PathVariable Long widgetId,
      @Valid @RequestBody WidgetDto widget,
      Principal principal) {
    return dashboardService.updateWidget(id, widgetId, widget, principal.getName());
  }

  @DeleteMapping("/dashboards/{id}/widgets/{widgetId}")
  public ResponseEntity<Void> deleteWidget(
      @PathVariable Long id, @PathVariable Long widgetId, Principal principal) {
    dashboardService.deleteWidget(id, widgetId, principal.getName());
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/dashboards/{id}/share")
  public DashboardResponse setShare(
      @PathVariable Long id,
      @RequestParam(defaultValue = "true") boolean enabled,
      Principal principal) {
    return dashboardService.setShare(id, enabled, principal.getName());
  }

  @PutMapping("/dashboards/{id}/schedule")
  public DashboardResponse setSchedule(
      @PathVariable Long id, @Valid @RequestBody ScheduleRequest request, Principal principal) {
    return dashboardService.setSchedule(
        id, request.getFrequency(), request.getRecipient(), principal.getName());
  }

  @PostMapping("/dashboards/{id}/send-now")
  public Map<String, String> sendNow(@PathVariable Long id, Principal principal) {
    return Map.of("status", reportService.sendNow(id, principal.getName()));
  }
}
