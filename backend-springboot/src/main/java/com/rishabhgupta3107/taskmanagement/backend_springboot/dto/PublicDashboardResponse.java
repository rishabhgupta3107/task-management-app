package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/** Everything the public (white-label) view needs in a single unauthenticated call. */
@Getter
@Setter
public class PublicDashboardResponse {

  private String dashboardName;
  private String clientName;
  private String brandColor;
  private String logoUrl;
  private List<WidgetDto> widgets = new ArrayList<>();
  private List<MetricPointDto> metrics = new ArrayList<>();
}
