package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardResponse {

  private Long id;
  private String name;
  private String template;
  private boolean shareEnabled;
  private String shareToken;
  private Long clientId;
  private String clientName;
  private String brandColor;
  private String scheduleFrequency;
  private String scheduleRecipient;
  private List<WidgetDto> widgets = new ArrayList<>();
}
