package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Dashboard;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.MetricPoint;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.MetricPointRepository;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Builds and sends dashboard report emails. Email delivery is optional: it only occurs when a JavaMailSender is configured (spring.mail.*). Otherwise the report is logged, so the app runs fine without SMTP.
 */
@Service
@RequiredArgsConstructor
public class ReportService {

  private static final Logger log = LoggerFactory.getLogger(ReportService.class);
  private static final List<String> SUMMARY_KEYS = List.of("sessions", "conversions", "spend", "revenue");

  private final MetricPointRepository metricRepository;
  private final DashboardService dashboardService;
  private final ObjectProvider<JavaMailSender> mailSenderProvider;

  @Value("${app.public-base-url:http://localhost:8081}")
  private String publicBaseUrl;

  @Value("${app.mail.from:reports@helm.local}")
  private String fromAddress;

  @Transactional(readOnly = true)
  public String sendNow(Long dashboardId, String username) {
    return sendReport(dashboardService.requireOwned(dashboardId, username));
  }

  /** Sends the report for a dashboard. Must be called within a transaction (lazy client access). */
  public String sendReport(Dashboard dashboard) {
    String recipient = dashboard.getScheduleRecipient();
    String subject = "[HELM] " + dashboard.getName() + " — report for " + dashboard.getClient().getName();
    String body = buildBody(dashboard);

    JavaMailSender sender = mailSenderProvider.getIfAvailable();
    if (sender == null || recipient == null || recipient.isBlank()) {
      log.info("Report ready for '{}' (no SMTP or recipient — not emailed):\n{}", subject, body);
      return sender == null ? "No SMTP configured — report logged." : "No recipient set.";
    }
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(fromAddress);
      message.setTo(recipient);
      message.setSubject(subject);
      message.setText(body);
      sender.send(message);
      return "Report sent to " + recipient + ".";
    } catch (Exception ex) {
      log.warn("Failed to send report email: {}", ex.getMessage());
      return "Could not send email: " + ex.getMessage();
    }
  }

  private String buildBody(Dashboard dashboard) {
    LocalDate to = LocalDate.now();
    LocalDate from = to.minusDays(30);
    List<MetricPoint> points =
        metricRepository.findByClientIdAndDateBetweenOrderByDateAsc(dashboard.getClient().getId(), from, to);

    Map<String, Double> totals = new LinkedHashMap<>();
    for (String key : SUMMARY_KEYS) {
      totals.put(key, 0.0);
    }
    for (MetricPoint p : points) {
      if (totals.containsKey(p.getMetricKey())) {
        totals.merge(p.getMetricKey(), p.getValue(), Double::sum);
      }
    }

    StringBuilder sb = new StringBuilder();
    sb.append(dashboard.getClient().getName()).append(" — last 30 days\n\n");
    totals.forEach((k, v) -> sb.append("  • ").append(k).append(": ").append(Math.round(v)).append('\n'));
    if (dashboard.isShareEnabled() && dashboard.getShareToken() != null) {
      sb.append("\nLive dashboard: ").append(publicBaseUrl).append("/share/").append(dashboard.getShareToken());
    }
    sb.append("\n\nSent by HELM.");
    return sb.toString();
  }
}
