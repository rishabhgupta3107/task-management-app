package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;
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
