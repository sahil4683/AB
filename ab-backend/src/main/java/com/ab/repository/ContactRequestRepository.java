package com.ab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ab.model.ContactRequest;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {
}


