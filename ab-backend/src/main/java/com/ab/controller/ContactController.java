package com.ab.controller;

import com.ab.dto.ContactRequestDTO;
import com.ab.model.ContactRequest;
import com.ab.service.ContactRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Contact Request management.
 * Provides endpoints for handling customer inquiries.
 */
@Slf4j
@RestController
@RequestMapping("/contact-requests")
@RequiredArgsConstructor
@Tag(name = "Contact Management", description = "APIs for managing contact requests")
public class ContactController {

    private final ContactRequestService contactRequestService;

    /**
     * Create a new contact request.
     *
     * @param contactRequestDTO the contact request data
     * @return the created contact request
     */
    @PostMapping
    @Operation(summary = "Create contact request", description = "Submit a new customer contact request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Contact request created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContactRequest.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ContactRequest> createContactRequest(@Valid @RequestBody ContactRequestDTO contactRequestDTO) {
        log.info("POST /contact-requests - Creating contact request from: {}", contactRequestDTO.getEmail());
        ContactRequest contactRequest = contactRequestService.createContactRequest(contactRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(contactRequest);
    }

    /**
     * Retrieve all contact requests.
     *
     * @return list of contact requests
     */
    @GetMapping
    @Operation(summary = "Get all contact requests", description = "Retrieve all submitted contact requests")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved contact requests",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContactRequest.class)))
    public ResponseEntity<List<ContactRequest>> getAllContactRequests() {
        log.info("GET /contact-requests - Retrieving all contact requests");
        List<ContactRequest> contactRequests = contactRequestService.getAllContactRequests();
        return ResponseEntity.ok(contactRequests);
    }

    /**
     * Retrieve a specific contact request by ID.
     *
     * @param id the contact request ID
     * @return the contact request
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get contact request by ID", description = "Retrieve a specific contact request by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contact request found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContactRequest.class))),
            @ApiResponse(responseCode = "404", description = "Contact request not found")
    })
    public ResponseEntity<ContactRequest> getContactRequest(@PathVariable Long id) {
        log.info("GET /contact-requests/{} - Retrieving contact request", id);
        ContactRequest contactRequest = contactRequestService.getContactRequestById(id);
        return ResponseEntity.ok(contactRequest);
    }

    /**
     * Update a contact request.
     *
     * @param id the contact request ID
     * @param contactRequestDTO the updated data
     * @return the updated contact request
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update contact request", description = "Update an existing contact request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contact request updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContactRequest.class))),
            @ApiResponse(responseCode = "404", description = "Contact request not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ContactRequest> updateContactRequest(
            @PathVariable Long id,
            @Valid @RequestBody ContactRequestDTO contactRequestDTO) {

        log.info("PUT /contact-requests/{} - Updating contact request", id);
        ContactRequest updatedRequest = contactRequestService.updateContactRequest(id, contactRequestDTO);
        return ResponseEntity.ok(updatedRequest);
    }

    /**
     * Delete a contact request.
     *
     * @param id the contact request ID
     * @return no content
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete contact request", description = "Delete a contact request by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Contact request deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Contact request not found")
    })
    public ResponseEntity<Void> deleteContactRequest(@PathVariable Long id) {
        log.info("DELETE /contact-requests/{} - Deleting contact request", id);
        contactRequestService.deleteContactRequest(id);
        return ResponseEntity.noContent().build();
    }
}



