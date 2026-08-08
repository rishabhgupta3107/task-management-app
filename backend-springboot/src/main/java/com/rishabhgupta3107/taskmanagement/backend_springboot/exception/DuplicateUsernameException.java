package com.rishabhgupta3107.taskmanagement.backend_springboot.exception;

public class DuplicateUsernameException extends RuntimeException {

  public DuplicateUsernameException(String message) {
    super(message);
  }
}
