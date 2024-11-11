package com.rishabhgupta3107.taskmanagement.backend_springboot.security;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthenticationRequest {

    private String username;
    private String password;

    // Default constructor for JSON Parsing
    public AuthenticationRequest() {
    }

    public AuthenticationRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
