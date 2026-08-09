package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.OrgRole;
import lombok.Getter;
import lombok.Setter;

/** Change a member's designation and/or who they report to. Null fields are left unchanged. */
@Getter
@Setter
public class UpdateMemberRequest {

  private OrgRole orgRole;
  private String managerUsername;
}
