package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.PublicDashboardResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.WidgetDto;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Client;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Dashboard;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.DashboardRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.MetricPointRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.WidgetRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Serves the white-label public view via an unguessable share token (no authentication). */
@Service
@RequiredArgsConstructor
public class PublicDashboardService {

  private static final int PUBLIC_WINDOW_DAYS = 30;

  private final DashboardRepository dashboardRepository;
  private final WidgetRepository widgetRepository;
  private final MetricPointRepository metricRepository;

  @Transactional(readOnly = true)
  public PublicDashboardResponse getByToken(String token) {
    Dashboard dashboard =
        dashboardRepository
            .findByShareTokenAndShareEnabledTrue(token)
            .orElseThrow(() -> new EntityNotFoundException("Dashboard not found"));
    Client client = dashboard.getClient();

    PublicDashboardResponse response = new PublicDashboardResponse();
    response.setDashboardName(dashboard.getName());
    response.setClientName(client.getName());
    response.setBrandColor(client.getBrandColor());
    response.setLogoUrl(client.getLogoUrl());
    response.setWidgets(
        widgetRepository.findByDashboardIdOrderByPositionAsc(dashboard.getId()).stream()
            .map(this::toWidgetDto)
            .toList());

    LocalDate to = LocalDate.now();
    LocalDate from = to.minusDays(PUBLIC_WINDOW_DAYS);
    response.setMetrics(
        metricRepository
            .findByClientIdAndDateBetweenOrderByDateAsc(client.getId(), from, to)
            .stream()
            .map(MetricService::toDto)
            .toList());
    return response;
  }

  private WidgetDto toWidgetDto(com.rishabhgupta3107.taskmanagement.backend_springboot.model.Widget w) {
    WidgetDto dto = new WidgetDto();
    dto.setId(w.getId());
    dto.setType(w.getType());
    dto.setTitle(w.getTitle());
    dto.setMetricKey(w.getMetricKey());
    dto.setAggregation(w.getAggregation());
    dto.setPosition(w.getPosition());
    return dto;
  }
}
