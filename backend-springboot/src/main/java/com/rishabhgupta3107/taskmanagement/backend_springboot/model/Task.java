package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Title is Mandatory.")
  @Size(max = 100, message = "Title must be less than 100 characters.")
  private String title;

  @NotBlank(message = "Description is Mandatory.")
  @Size(max = 1000, message = "Description must be less than 100 characters.")
  private String description;

  @Enumerated(EnumType.STRING)
  private Status status;

  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dueDate;

  public enum Status {
    TO_DO("TO_DO"),
    IN_PROGRESS("IN_PROGRESS"),
    DONE("DONE");

    private final String value;

    Status(String value){
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
      throw  new IllegalArgumentException("Invalid Status");
    }

  }
}
