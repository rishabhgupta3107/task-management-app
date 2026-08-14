package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.rishabhgupta3107.taskmanagement.backend_springboot.controller.TaskController;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.TaskService;
import java.security.Principal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class TaskControllerTest {

  private static final String USERNAME = "rishabh";

  @Mock private TaskService taskService;
  @Mock private Principal principal;

  @InjectMocks private TaskController taskController;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    when(principal.getName()).thenReturn(USERNAME);
  }

  private TaskResponse sampleResponse() {
    TaskResponse response = new TaskResponse();
    response.setId(1L);
    response.setTitle("Task 1");
    response.setStatus(Task.Status.TO_DO);
    response.setPriority(Task.Priority.MEDIUM);
    return response;
  }

  @Test
  public void testGetTaskById() {
    when(taskService.getTaskById(1L, USERNAME)).thenReturn(sampleResponse());

    ResponseEntity<TaskResponse> response = taskController.getTaskById(1L, principal);

    assertNotNull(response.getBody());
    assertEquals("Task 1", response.getBody().getTitle());
    verify(taskService, times(1)).getTaskById(1L, USERNAME);
  }

  @Test
  public void testCreateTaskReturns201() {
    TaskRequest request = new TaskRequest();
    when(taskService.createTask(request, USERNAME)).thenReturn(sampleResponse());

    ResponseEntity<TaskResponse> response = taskController.createTask(request, principal);

    assertEquals(HttpStatus.CREATED, response.getStatusCode());
    assertNotNull(response.getBody());
    verify(taskService, times(1)).createTask(request, USERNAME);
  }

  @Test
  public void testDeleteTaskReturns204() {
    ResponseEntity<Void> response = taskController.deleteTask(1L, principal);

    assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    verify(taskService, times(1)).deleteTask(1L, USERNAME);
  }
}
