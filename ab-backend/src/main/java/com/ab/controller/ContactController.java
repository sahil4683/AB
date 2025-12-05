package com.ab.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ab.model.ContactRequest;
import com.ab.repository.ContactRequestRepository;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:4200")
public class ContactController {

    private final ContactRequestRepository contactRequestRepository;

    public ContactController(ContactRequestRepository contactRequestRepository) {
        this.contactRequestRepository = contactRequestRepository;
    }

    @PostMapping
    public ContactRequest create(@RequestBody ContactRequest request) {
        return contactRequestRepository.save(request);
    }
}


