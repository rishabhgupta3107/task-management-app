package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Dashboard;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.DashboardRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Fires due dashboard reports once a day. */
@Component
@RequiredArgsConstructor
public class ReportScheduler {

  private static final Logger log = LoggerFactory.getLogger(ReportScheduler.class);

  private final DashboardRepository dashboardRepository;
  private final ReportService reportService;

  /** Every day at 07:00 server time. */
  @Scheduled(cron = "0 0 7 * * *")
  @Transactional
  public void sendDueReports() {
    LocalDate today = LocalDate.now();
    for (Dashboard dashboard : dashboardRepository.findByScheduleFrequencyNot("NONE")) {
      if (isDue(dashboard, today)) {
        reportService.sendReport(dashboard);
        dashboard.setLastSentAt(today);
        dashboardRepository.save(dashboard);
        log.info("Sent scheduled report for dashboard {}", dashboard.getId());
      }
    }
  }

  private boolean isDue(Dashboard d, LocalDate today) {
    LocalDate last = d.getLastSentAt();
    return switch (d.getScheduleFrequency() == null ? "NONE" : d.getScheduleFrequency()) {
      case "DAILY" -> last == null || last.isBefore(today);
      case "WEEKLY" -> last == null || !last.isAfter(today.minusDays(7));
      case "MONTHLY" -> last == null || !last.isAfter(today.minusDays(30));
      default -> false;
    };
  }
}
