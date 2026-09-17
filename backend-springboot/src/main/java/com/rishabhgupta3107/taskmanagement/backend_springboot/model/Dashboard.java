package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

/** A dashboard belonging to a client, made up of widgets. */
@Entity
@Table(name = "dashboard")
@Data
public class Dashboard {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120)
  private String name;

  /** Template the dashboard was seeded from (SEO, PAID_ADS, SOCIAL, EMAIL, BLANK). */
  @Column(length = 30)
  private String template;

  /** Capability token for the public white-label view; null until sharing is enabled. */
  @Column(name = "share_token", length = 64, unique = true)
  private String shareToken;

  @Column(name = "share_enabled", nullable = false)
  private boolean shareEnabled = false;

  /** Scheduled report cadence: NONE, DAILY, WEEKLY, MONTHLY. */
  @Column(name = "schedule_frequency", length = 12)
  private String scheduleFrequency = "NONE";

  /** Email address the scheduled report is sent to. */
  @Column(name = "schedule_recipient", length = 150)
  private String scheduleRecipient;

  @Column(name = "last_sent_at")
  private java.time.LocalDate lastSentAt;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "client_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Client client;
}
