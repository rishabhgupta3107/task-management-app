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

/** A client account that an agency (the owner) manages and reports on. */
@Entity
@Table(name = "client")
@Data
public class Client {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(length = 80)
  private String industry;

  /** White-label brand accent (hex). */
  @Column(name = "brand_color", length = 16)
  private String brandColor;

  @Column(name = "logo_url", length = 500)
  private String logoUrl;

  /** Capability token for token-authenticated metric ingestion (per-client push API). */
  @Column(name = "ingest_token", length = 64, unique = true)
  private String ingestToken;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  /** The agency user who owns this client. */
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "owner_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Users owner;
}
