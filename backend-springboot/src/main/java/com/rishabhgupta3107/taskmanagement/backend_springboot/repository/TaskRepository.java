package com.rishabhgupta3107.taskmanagement.backend_springboot.repository;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

  Page<Task> findByOwnerUsername(String username, Pageable pageable);

  Optional<Task> findByIdAndOwnerUsername(Long id, String username);

  List<Task> findByOwnerUsernameAndStatus(String username, Task.Status status);

  List<Task>
      findByOwnerUsernameAndTitleContainingIgnoreCaseOrOwnerUsernameAndDescriptionContainingIgnoreCase(
          String usernameForTitle,
          String title,
          String usernameForDescription,
          String description);
}
