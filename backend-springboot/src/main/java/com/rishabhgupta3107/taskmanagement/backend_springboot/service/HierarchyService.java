package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Users;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.UsersRepository;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Reporting-tree helpers: ancestry checks and descendant collection. */
@Service
@RequiredArgsConstructor
public class HierarchyService {

  private static final int MAX_DEPTH = 100;

  private final UsersRepository usersRepository;

  /** True if {@code managerUsername} is an ancestor (any level up) of {@code memberUsername}. */
  @Transactional(readOnly = true)
  public boolean isManagerOf(String managerUsername, String memberUsername) {
    if (managerUsername == null || memberUsername == null || managerUsername.equals(memberUsername)) {
      return false;
    }
    Users member = usersRepository.findByUsername(memberUsername).orElse(null);
    if (member == null) {
      return false;
    }
    Users cursor = member.getManager();
    int guard = 0;
    while (cursor != null && guard++ < MAX_DEPTH) {
      if (managerUsername.equals(cursor.getUsername())) {
        return true;
      }
      cursor = cursor.getManager();
    }
    return false;
  }

  /** All users below {@code username} in the tree (direct and indirect reports). */
  @Transactional(readOnly = true)
  public List<Users> descendants(String username) {
    List<Users> result = new ArrayList<>();
    Users root = usersRepository.findByUsername(username).orElse(null);
    if (root == null) {
      return result;
    }
    Deque<Users> queue = new ArrayDeque<>(usersRepository.findByManagerId(root.getId()));
    int guard = 0;
    while (!queue.isEmpty() && guard++ < 10_000) {
      Users current = queue.poll();
      result.add(current);
      queue.addAll(usersRepository.findByManagerId(current.getId()));
    }
    return result;
  }
}
