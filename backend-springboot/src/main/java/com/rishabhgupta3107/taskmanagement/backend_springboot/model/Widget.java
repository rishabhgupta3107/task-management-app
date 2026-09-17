package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/** A single visualization on a dashboard, bound to a metric key. */
@Entity
@Table(name = "widget")
@Data
public class Widget {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private WidgetType type;

  @Column(nullable = false, length = 120)
  private String title;

  /** The metric this widget renders (e.g. "sessions", "spend", "roas"). */
  @Column(name = "metric_key", length = 60)
  private String metricKey;

  /** How a KPI aggregates its series: SUM, AVG, or LAST. */
  @Column(length = 10)
  private String aggregation;

  /** Ordering within the dashboard grid. */
  @Column(nullable = false)
  private int position;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "dashboard_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Dashboard dashboard;

  public enum WidgetType {
    KPI,
    LINE,
    BAR,
    DONUT,
    TABLE
  }
}
