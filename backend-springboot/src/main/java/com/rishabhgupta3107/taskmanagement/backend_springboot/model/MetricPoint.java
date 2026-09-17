package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/** A single connector-agnostic time-series data point for a client. */
@Entity
@Table(
    name = "metric_point",
    indexes = {@Index(name = "idx_metric_client_key_date", columnList = "client_id,metric_key,date")})
@Data
public class MetricPoint {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "metric_key", nullable = false, length = 60)
  private String metricKey;

  /** Optional source/channel, e.g. "google_ads", "seo", "email". */
  @Column(length = 40)
  private String channel;

  @Column(nullable = false)
  private LocalDate date;

  @Column(nullable = false)
  private double value;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "client_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Client client;
}
