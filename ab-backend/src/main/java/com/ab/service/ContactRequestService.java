package com.ab.service;

import com.ab.dto.ContactRequestDTO;
import com.ab.exception.ResourceNotFoundException;
import com.ab.model.ContactRequest;
import com.ab.repository.ContactRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer for Contact Request business logic.
 * Handles all contact request operations and provides abstraction over the repository layer.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;

    /**
     * Creates a new contact request.
     *
     * @param contactRequestDTO the contact request data
     * @return the created contact request entity
     */
    @Transactional
    public ContactRequest createContactRequest(ContactRequestDTO contactRequestDTO) {
        log.info("Creating new contact request from: {}", contactRequestDTO.getEmail());

        ContactRequest contactRequest = ContactRequest.builder()
                .name(contactRequestDTO.getName())
                .email(contactRequestDTO.getEmail())
                .phone(contactRequestDTO.getPhone())
                .message(contactRequestDTO.getMessage())
                .build();

        ContactRequest savedRequest = contactRequestRepository.save(contactRequest);
        log.info("Contact request created successfully with id: {}", savedRequest.getId());

        return savedRequest;
    }

    /**
     * Retrieves a specific contact request by ID.
     *
     * @param id the contact request ID
     * @return the contact request entity
     * @throws ResourceNotFoundException if contact request is not found
     */
    public ContactRequest getContactRequestById(Long id) {
        log.debug("Fetching contact request with id: {}", id);

        return contactRequestRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Contact request not found with id: {}", id);
                    return new ResourceNotFoundException("Contact request not found with id: " + id);
                });
    }

    /**
     * Retrieves all contact requests.
     *
     * @return list of contact request entities
     */
    public List<ContactRequest> getAllContactRequests() {
        log.debug("Fetching all contact requests");
        List<ContactRequest> requests = contactRequestRepository.findAll();
        log.info("Retrieved {} contact requests", requests.size());
        return requests;
    }

    /**
     * Updates a contact request.
     *
     * @param id the contact request ID
     * @param contactRequestDTO the updated data
     * @return the updated contact request entity
     * @throws ResourceNotFoundException if contact request is not found
     */
    @Transactional
    public ContactRequest updateContactRequest(Long id, ContactRequestDTO contactRequestDTO) {
        log.info("Updating contact request with id: {}", id);

        ContactRequest contactRequest = contactRequestRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Contact request not found with id: {}", id);
                    return new ResourceNotFoundException("Contact request not found with id: " + id);
                });

        contactRequest.setName(contactRequestDTO.getName());
        contactRequest.setEmail(contactRequestDTO.getEmail());
        contactRequest.setPhone(contactRequestDTO.getPhone());
        contactRequest.setMessage(contactRequestDTO.getMessage());

        ContactRequest updatedRequest = contactRequestRepository.save(contactRequest);
        log.info("Contact request updated successfully with id: {}", id);

        return updatedRequest;
    }

    /**
     * Deletes a contact request.
     *
     * @param id the contact request ID
     * @throws ResourceNotFoundException if contact request is not found
     */
    @Transactional
    public void deleteContactRequest(Long id) {
        log.info("Deleting contact request with id: {}", id);

        if (!contactRequestRepository.existsById(id)) {
            log.warn("Contact request not found with id: {}", id);
            throw new ResourceNotFoundException("Contact request not found with id: " + id);
        }

        contactRequestRepository.deleteById(id);
        log.info("Contact request deleted successfully with id: {}", id);
    }
}
