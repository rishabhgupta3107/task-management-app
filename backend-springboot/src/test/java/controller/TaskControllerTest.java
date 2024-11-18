package controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.rishabhgupta3107.taskmanagement.backend_springboot.controller.TaskController;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.TaskService;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

public class TaskControllerTest {

  @Mock private TaskService taskService;

  @InjectMocks private TaskController taskController;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testGetAllTasks() {
    List<Task> tasks =
        Arrays.asList(
            new Task(1L, "Task 1", "Description 1", Task.Status.TO_DO, null),
            new Task(2L, "Task 2", "Description 2", Task.Status.DONE, null));

    when(taskService.getAllTasks()).thenReturn(tasks);

    List<Task> result = taskController.getAllTasks();
    assertEquals(2, result.size());
    verify(taskService, times(1)).getAllTasks();
  }

  @Test
  public void testGetTaskById() {
    Task task = new Task(1L, "Task 1", "Description 1", Task.Status.TO_DO, null);

    when(taskService.getTaskById(1L)).thenReturn(task);

    ResponseEntity<Task> response = taskController.getTaskById(1L);
    Task result = response.getBody();
    assertNotNull(result);
    assertEquals("Task 1", result.getTitle());
    verify(taskService, times(1)).getTaskById(1L);
  }

  @Test
  public void testCreateTask() {
    Task task = new Task(1L, "Task 1", "Description 1", Task.Status.TO_DO, null);

    when(taskService.createTask(task)).thenReturn(task);

    ResponseEntity<Task> response = taskController.createTask(task);
    Task result = response.getBody();
    assertNotNull(result);
    assertEquals("Task 1", result.getTitle());
    verify(taskService, times(1)).createTask(task);
  }

  @Test
  public void testUpdateTask() {
    Task task = new Task(1L, "Task 1", "Description 1", Task.Status.TO_DO, null);

    when(taskService.updateTask(1L, task)).thenReturn(task);

    ResponseEntity<Task> response = taskController.updateTask(1L, task);
    Task result = response.getBody();
    assertNotNull(result);
    assertEquals("Task 1", result.getTitle());
    verify(taskService, times(1)).updateTask(1L, task);
  }

  @Test
  public void testDeleteTask() {
    doNothing().when(taskService).deleteTask(1L);

    taskController.deleteTask(1L);
    verify(taskService, times(1)).deleteTask(1L);
  }
}
