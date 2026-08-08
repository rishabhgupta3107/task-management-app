package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.RegisterRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.exception.DuplicateUsernameException;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Users;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UsersRepository usersRepository;
  private final PasswordEncoder passwordEncoder;

  @Transactional
  public void register(RegisterRequest request) {
    if (usersRepository.existsByUsername(request.getUsername())) {
      throw new DuplicateUsernameException(
          "Username '" + request.getUsername() + "' is already taken.");
    }

    Users user = new Users();
    user.setUsername(request.getUsername());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole("ROLE_USER");
    usersRepository.save(user);
  }
}
