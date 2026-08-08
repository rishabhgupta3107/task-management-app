package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** A checklist item belonging to a Task. Stored in the task_subtasks collection table. */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subtask {

  @Column(name = "title", nullable = false, length = 200)
  private String title;

  @Column(name = "done", nullable = false)
  private boolean done;
}
