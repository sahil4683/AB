package com.ab.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping
    public List<ContactRequest> getAllContactRequests() {
        return contactRequestRepository.findAll();
    }

    @PutMapping("/{id}")
    public ContactRequest updateContactRequest(@PathVariable Long id, @RequestBody ContactRequest request) {
        return contactRequestRepository.findById(id).map(existing -> {
            existing.setComplete(request.isComplete());
            return contactRequestRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Contact request not found"));
    }
}


