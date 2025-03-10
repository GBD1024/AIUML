package com.example.roadmllm.DTO;

public class PhoneCheckResponse {
    private boolean registered;

    public PhoneCheckResponse(boolean registered) {
        this.registered = registered;
    }

    public boolean isRegistered() {
        return registered;
    }

    public void setRegistered(boolean registered) {
        this.registered = registered;
    }
}