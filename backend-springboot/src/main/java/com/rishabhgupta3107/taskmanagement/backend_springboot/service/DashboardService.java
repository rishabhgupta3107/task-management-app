package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.CreateDashboardRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.DashboardResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.DashboardSummary;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.WidgetDto;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Client;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Dashboard;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Widget;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.DashboardRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.WidgetRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

  private final DashboardRepository dashboardRepository;
  private final WidgetRepository widgetRepository;
  private final ClientService clientService;

  @Transactional(readOnly = true)
  public List<DashboardSummary> listForClient(Long clientId, String username) {
    clientService.requireOwned(clientId, username);
    return dashboardRepository
        .findByClientIdAndClientOwnerUsernameOrderByCreatedAtDesc(clientId, username)
        .stream()
        .map(this::toSummary)
        .toList();
  }

  @Transactional
  public DashboardResponse create(Long clientId, CreateDashboardRequest request, String username) {
    Client client = clientService.requireOwned(clientId, username);

    Dashboard dashboard = new Dashboard();
    dashboard.setName(request.getName());
    dashboard.setTemplate(request.getTemplate() != null ? request.getTemplate() : "BLANK");
    dashboard.setClient(client);
    Dashboard saved = dashboardRepository.save(dashboard);

    int position = 0;
    for (Widget w : templateWidgets(dashboard.getTemplate())) {
      w.setDashboard(saved);
      w.setPosition(position++);
      widgetRepository.save(w);
    }
    return toResponse(saved);
  }

  @Transactional(readOnly = true)
  public DashboardResponse get(Long id, String username) {
    return toResponse(requireOwned(id, username));
  }

  @Transactional
  public void delete(Long id, String username) {
    dashboardRepository.delete(requireOwned(id, username));
  }

  // ----- widgets -----

  @Transactional
  public WidgetDto addWidget(Long dashboardId, WidgetDto dto, String username) {
    Dashboard dashboard = requireOwned(dashboardId, username);
    Widget widget = new Widget();
    apply(dto, widget);
    widget.setDashboard(dashboard);
    widget.setPosition((int) widgetRepository.countByDashboardId(dashboardId));
    return toWidgetDto(widgetRepository.save(widget));
  }

  @Transactional
  public WidgetDto updateWidget(Long dashboardId, Long widgetId, WidgetDto dto, String username) {
    requireOwned(dashboardId, username);
    Widget widget =
        widgetRepository
            .findByIdAndDashboardId(widgetId, dashboardId)
            .orElseThrow(() -> new EntityNotFoundException("Widget not found"));
    apply(dto, widget);
    return toWidgetDto(widgetRepository.save(widget));
  }

  @Transactional
  public void deleteWidget(Long dashboardId, Long widgetId, String username) {
    requireOwned(dashboardId, username);
    Widget widget =
        widgetRepository
            .findByIdAndDashboardId(widgetId, dashboardId)
            .orElseThrow(() -> new EntityNotFoundException("Widget not found"));
    widgetRepository.delete(widget);
  }

  // ----- sharing -----

  @Transactional
  public DashboardResponse setShare(Long id, boolean enabled, String username) {
    Dashboard dashboard = requireOwned(id, username);
    if (enabled && dashboard.getShareToken() == null) {
      dashboard.setShareToken("shr_" + UUID.randomUUID().toString().replace("-", ""));
    }
    dashboard.setShareEnabled(enabled);
    return toResponse(dashboardRepository.save(dashboard));
  }

  @Transactional
  public DashboardResponse setSchedule(Long id, String frequency, String recipient, String username) {
    Dashboard dashboard = requireOwned(id, username);
    dashboard.setScheduleFrequency(frequency != null ? frequency.toUpperCase() : "NONE");
    dashboard.setScheduleRecipient(recipient);
    return toResponse(dashboardRepository.save(dashboard));
  }

  public Dashboard requireOwned(Long id, String username) {
    return dashboardRepository
        .findByIdAndClientOwnerUsername(id, username)
        .orElseThrow(() -> new EntityNotFoundException("Dashboard not found"));
  }

  // ----- mapping -----

  private void apply(WidgetDto dto, Widget widget) {
    widget.setType(dto.getType());
    widget.setTitle(dto.getTitle());
    widget.setMetricKey(dto.getMetricKey());
    widget.setAggregation(dto.getAggregation() != null ? dto.getAggregation() : "SUM");
  }

  private DashboardSummary toSummary(Dashboard d) {
    DashboardSummary s = new DashboardSummary();
    s.setId(d.getId());
    s.setName(d.getName());
    s.setTemplate(d.getTemplate());
    s.setShareEnabled(d.isShareEnabled());
    s.setWidgetCount((int) widgetRepository.countByDashboardId(d.getId()));
    return s;
  }

  private DashboardResponse toResponse(Dashboard d) {
    DashboardResponse r = new DashboardResponse();
    r.setId(d.getId());
    r.setName(d.getName());
    r.setTemplate(d.getTemplate());
    r.setShareEnabled(d.isShareEnabled());
    r.setShareToken(d.getShareToken());
    r.setClientId(d.getClient().getId());
    r.setClientName(d.getClient().getName());
    r.setBrandColor(d.getClient().getBrandColor());
    r.setScheduleFrequency(d.getScheduleFrequency());
    r.setScheduleRecipient(d.getScheduleRecipient());
    r.setWidgets(
        widgetRepository.findByDashboardIdOrderByPositionAsc(d.getId()).stream()
            .map(this::toWidgetDto)
            .toList());
    return r;
  }

  private WidgetDto toWidgetDto(Widget w) {
    WidgetDto dto = new WidgetDto();
    dto.setId(w.getId());
    dto.setType(w.getType());
    dto.setTitle(w.getTitle());
    dto.setMetricKey(w.getMetricKey());
    dto.setAggregation(w.getAggregation());
    dto.setPosition(w.getPosition());
    return dto;
  }

  /** Starter widgets per template. Metric keys are conventions; data is ingested separately. */
  private List<Widget> templateWidgets(String template) {
    List<Widget> widgets = new ArrayList<>();
    switch (template == null ? "BLANK" : template.toUpperCase()) {
      case "SEO" -> {
        widgets.add(widget(Widget.WidgetType.KPI, "Sessions", "sessions", "SUM"));
        widgets.add(widget(Widget.WidgetType.KPI, "Conversions", "conversions", "SUM"));
        widgets.add(widget(Widget.WidgetType.KPI, "Impressions", "impressions", "SUM"));
        widgets.add(widget(Widget.WidgetType.LINE, "Sessions trend", "sessions", "SUM"));
        widgets.add(widget(Widget.WidgetType.BAR, "Conversions by day", "conversions", "SUM"));
        widgets.add(widget(Widget.WidgetType.TABLE, "Daily sessions", "sessions", "SUM"));
      }
      case "PAID_ADS" -> {
        widgets.add(widget(Widget.WidgetType.KPI, "Ad Spend", "spend", "SUM"));
        widgets.add(widget(Widget.WidgetType.KPI, "Revenue", "revenue", "SUM"));
        widgets.add(widget(Widget.WidgetType.KPI, "Conversions", "conversions", "SUM"));
        widgets.add(widget(Widget.WidgetType.KPI, "Clicks", "clicks", "SUM"));
        widgets.add(widget(Widget.WidgetType.LINE, "Revenue trend", "revenue", "SUM"));
        widgets.add(widget(Widget.WidgetType.DONUT, "Spend by channel", "spend", "SUM"));
        widgets.add(widget(Widget.WidgetType.BAR, "Conversions by day", "conversions", "SUM"));
      }
      case "SOCIAL" -> {
        widgets.add(widget(Widget.WidgetType.KPI, "Impressions", "impressions", "SUM"));
        widgets.add(widget(Widget.WidgetType.KPI, "Clicks", "clicks", "SUM"));
        widgets.add(widget(Widget.WidgetType.LINE, "Impressions trend", "impressions", "SUM"));
        widgets.add(widget(Widget.WidgetType.BAR, "Clicks by day", "clicks", "SUM"));
      }
      case "EMAIL" -> {
        widgets.add(widget(Widget.WidgetType.KPI, "Sends", "sends", "SUM"));
        widgets.add(widget(Widget.WidgetType.KPI, "Opens", "opens", "SUM"));
        widgets.add(widget(Widget.WidgetType.KPI, "Clicks", "clicks", "SUM"));
        widgets.add(widget(Widget.WidgetType.LINE, "Opens trend", "opens", "SUM"));
      }
      default -> {
        /* BLANK — no starter widgets */
      }
    }
    return widgets;
  }

  private Widget widget(Widget.WidgetType type, String title, String metricKey, String agg) {
    Widget w = new Widget();
    w.setType(type);
    w.setTitle(title);
    w.setMetricKey(metricKey);
    w.setAggregation(agg);
    return w;
  }
}
