package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import lombok.Getter;
import lombok.Setter;

/** Public, minimal user info for the registration "reports to" picker. */
@Getter
@Setter
public class ManagerOption {

  private String username;
  private String fullName;

  public ManagerOption(String username, String fullName) {
    this.username = username;
    this.fullName = fullName;
  }
}
