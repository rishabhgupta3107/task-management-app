package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Users;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.TaskRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.UsersRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.HierarchyService;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class TaskServiceTest {

  private static final String USERNAME = "rishabh";

  @Mock private TaskRepository taskRepository;
  @Mock private UsersRepository usersRepository;
  @Mock private HierarchyService hierarchy;

  @InjectMocks private TaskService taskService;

  private Users owner;
  private Task task;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);

    owner = new Users();
    owner.setId(1L);
    owner.setUsername(USERNAME);

    task = new Task();
    task.setId(1L);
    task.setTitle("Test Task");
    task.setDescription("Test Description");
    task.setStatus(Task.Status.TO_DO);
    task.setPriority(Task.Priority.MEDIUM);
    task.setOwner(owner);
    task.setAssignee(owner);
  }

  private TaskRequest sampleRequest() {
    TaskRequest request = new TaskRequest();
    request.setTitle("Test Task");
    request.setDescription("Test Description");
    request.setStatus(Task.Status.TO_DO);
    request.setPriority(Task.Priority.MEDIUM);
    return request;
  }

  @Test
  public void testCreateTaskAssignsCreatorByDefault() {
    when(usersRepository.findByUsername(USERNAME)).thenReturn(Optional.of(owner));
    when(taskRepository.save(any(Task.class))).thenReturn(task);

    TaskResponse created = taskService.createTask(sampleRequest(), USERNAME);

    assertNotNull(created);
    assertEquals("Test Task", created.getTitle());
    verify(taskRepository, times(1)).save(any(Task.class));
  }

  @Test
  public void testUpdateTaskWhenAssigned() {
    when(taskRepository.findByIdAndAssigneeUsername(1L, USERNAME)).thenReturn(Optional.of(task));
    when(taskRepository.save(any(Task.class))).thenReturn(task);

    TaskResponse updated = taskService.updateTask(1L, sampleRequest(), USERNAME);

    assertEquals("Test Task", updated.getTitle());
  }

  @Test
  public void testUpdateTaskNotAssignedThrows() {
    when(taskRepository.findByIdAndAssigneeUsername(1L, USERNAME)).thenReturn(Optional.empty());

    assertThrows(
        EntityNotFoundException.class, () -> taskService.updateTask(1L, sampleRequest(), USERNAME));
    verify(taskRepository, never()).save(any(Task.class));
  }

  @Test
  public void testDeleteTaskWhenAssigned() {
    when(taskRepository.findByIdAndAssigneeUsername(1L, USERNAME)).thenReturn(Optional.of(task));

    taskService.deleteTask(1L, USERNAME);

    verify(taskRepository, times(1)).delete(task);
  }

  @Test
  public void testGetTaskByIdNotFoundThrows() {
    when(taskRepository.findById(99L)).thenReturn(Optional.empty());

    assertThrows(EntityNotFoundException.class, () -> taskService.getTaskById(99L, USERNAME));
  }
}
