package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Title is Mandatory.")
    @Size(max=100, message="Title must be less than 100 characters.")
    private String title;

    @NotBlank(message="Description is Mandatory.")
    @Size(max=1000, message="Description must be less than 100 characters.")
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDate dueDate;

    public enum Status {
        TO_DO,
        IN_PROGRESS,
        DONE
    }
}