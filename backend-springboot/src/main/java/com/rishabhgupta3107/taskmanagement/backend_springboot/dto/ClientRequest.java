package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientRequest {

  @NotBlank(message = "Client name is required.")
  @Size(max = 120, message = "Name must be at most 120 characters.")
  private String name;

  @Size(max = 80)
  private String industry;

  @Size(max = 16)
  private String brandColor;

  @Size(max = 500)
  private String logoUrl;
}
