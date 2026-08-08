package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  private String description;

  @Enumerated(EnumType.STRING)
  private Status status;

  @Enumerated(EnumType.STRING)
  private Priority priority;

  private LocalDate dueDate;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private Users owner;

  public enum Status {
    TO_DO("TO_DO"),
    IN_PROGRESS("IN_PROGRESS"),
    DONE("DONE");

    private final String value;

    Status(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

    @Override
    public String toString() {
      return this.value;
    }

    @JsonCreator
    public static Status fromValue(String value) {
      for (Status status : Status.values()) {
        if (status.value.equalsIgnoreCase(value)) {
          return status;
        }
      }
      throw new IllegalArgumentException("Invalid Status: " + value);
    }
  }

  public enum Priority {
    LOW("LOW"),
    MEDIUM("MEDIUM"),
    HIGH("HIGH");

    private final String value;

    Priority(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

    @Override
    public String toString() {
      return this.value;
    }

    @JsonCreator
    public static Priority fromValue(String value) {
      for (Priority priority : Priority.values()) {
        if (priority.value.equalsIgnoreCase(value)) {
          return priority;
        }
      }
      throw new IllegalArgumentException("Invalid Priority: " + value);
    }
  }
}
