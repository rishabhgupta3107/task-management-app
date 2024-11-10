package com.rishabhgupta3107.taskmanagement.backend_springboot.repository;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatus(Task.Status status);

    List<Task> findByTitleContainingOrDescriptionContaining(String title, String description);
}
