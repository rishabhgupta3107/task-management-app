package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientResponse {

  private Long id;
  private String name;
  private String industry;
  private String brandColor;
  private String logoUrl;
  private String ingestToken;
  private LocalDateTime createdAt;
  private long dashboardCount;
}
