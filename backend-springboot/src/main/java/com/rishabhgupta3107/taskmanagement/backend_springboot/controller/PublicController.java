package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.PublicDashboardResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.PublicDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Unauthenticated white-label endpoints, reached only via an unguessable share token. */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

  private final PublicDashboardService publicDashboardService;

  @GetMapping("/dashboards/{token}")
  public PublicDashboardResponse dashboard(@PathVariable String token) {
    return publicDashboardService.getByToken(token);
  }
}
