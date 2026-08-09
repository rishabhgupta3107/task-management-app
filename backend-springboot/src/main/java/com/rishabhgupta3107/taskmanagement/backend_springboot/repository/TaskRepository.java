package com.rishabhgupta3107.taskmanagement.backend_springboot.repository;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

  Page<Task> findByAssigneeUsername(String username, Pageable pageable);

  Optional<Task> findByIdAndAssigneeUsername(Long id, String username);

  List<Task> findByAssigneeUsernameAndStatus(String username, Task.Status status);

  long countByAssigneeUsernameAndStatusNot(String username, Task.Status status);

  @Query(
      "select t from Task t where t.assignee.username = :username and ("
          + "lower(t.title) like lower(concat('%', :keyword, '%')) or "
          + "lower(t.description) like lower(concat('%', :keyword, '%')))")
  List<Task> searchByAssignee(
      @Param("username") String username, @Param("keyword") String keyword);
}
