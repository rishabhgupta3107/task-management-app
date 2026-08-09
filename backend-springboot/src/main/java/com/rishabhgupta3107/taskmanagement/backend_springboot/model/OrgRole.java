package com.rishabhgupta3107.taskmanagement.backend_springboot.model;

/** Organisational role in the reporting hierarchy (distinct from the Spring Security role). */
public enum OrgRole {
  MANAGER,
  TEAM_LEAD,
  WORKER;

  /** Managers and team leads can oversee reports; workers cannot. */
  public boolean canManageTeam() {
    return this == MANAGER || this == TEAM_LEAD;
  }
}
