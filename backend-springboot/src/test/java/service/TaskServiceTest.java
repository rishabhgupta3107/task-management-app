package service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.TaskRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class TaskServiceTest {

  @Mock private TaskRepository taskRepository;

  @InjectMocks private TaskService taskService;

  private Task task;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    task = new Task();
    task.setId(1L);
    task.setTitle("Test Task");
    task.setDescription("Test Description");
    task.setStatus(Task.Status.TO_DO);
  }

  @Test
  public void testCreateTask() {
    when(taskRepository.save(any(Task.class))).thenReturn(task);
    Task createdTask = taskService.createTask(task);
    assertNotNull(createdTask);
    assertEquals("Test Task", createdTask.getTitle());
  }

  @Test
  public void testGetAllTasks() {
    when(taskRepository.findAll()).thenReturn(List.of(task));
    List<Task> tasks = taskService.getAllTasks();
    assertEquals(1, tasks.size());
  }

  @Test
  public void testUpdateTask() {
    when(taskRepository.existsById(1L)).thenReturn(true);
    when(taskRepository.save(any(Task.class))).thenReturn(task);
    Task updatedTask = taskService.updateTask(1L, task);
    assertEquals("Test Task", updatedTask.getTitle());
  }

  @Test
  public void testDeleteTask() {
    when(taskRepository.existsById(1L)).thenReturn(true);
    taskService.deleteTask(1L);
    verify(taskRepository, times(1)).deleteById(1L);
  }
}
