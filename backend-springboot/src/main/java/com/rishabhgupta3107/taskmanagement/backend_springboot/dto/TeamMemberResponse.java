package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.OrgRole;
import lombok.Getter;
import lombok.Setter;

/** A person in the current user's reporting tree. */
@Getter
@Setter
public class TeamMemberResponse {

  private Long id;
  private String username;
  private String fullName;
  private OrgRole orgRole;
  private String avatarUrl;
  private String managerUsername;
  private long activeTasks;
}
