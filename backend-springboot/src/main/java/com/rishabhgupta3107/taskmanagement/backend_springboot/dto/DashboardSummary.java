package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardSummary {

  private Long id;
  private String name;
  private String template;
  private boolean shareEnabled;
  private int widgetCount;
}
