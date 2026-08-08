package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

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
}
