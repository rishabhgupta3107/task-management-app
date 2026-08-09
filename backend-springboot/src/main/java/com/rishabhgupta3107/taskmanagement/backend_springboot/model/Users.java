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
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "users")
@Data
public class Users {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Username cannot be empty")
  @Column(nullable = false, unique = true)
  private String username;

  @NotBlank(message = "Password cannot be empty")
  @Column(nullable = false)
  private String password;

  @Column(nullable = false)
  private String role = "ROLE_USER";

  @Enumerated(EnumType.STRING)
  @Column(name = "org_role", nullable = false)
  private OrgRole orgRole = OrgRole.WORKER;

  /** The user this person reports to (null for the top of the tree). */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "manager_id")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Users manager;

  // ----- Profile -----
  @Column(name = "full_name", length = 100)
  private String fullName;

  @Column(length = 150)
  private String email;

  @Column(name = "dob")
  private LocalDate dob;

  @Column(name = "avatar_url", length = 500)
  private String avatarUrl;

  @Column(name = "title", length = 100)
  private String title;

  @Column(length = 500)
  private String bio;

  @Column(length = 64)
  private String timezone;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;
}
