package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.Organization;
import org.createyourevent.app.domain.enumeration.OrganizationType;
import org.createyourevent.app.repository.OrganizationExtRepository;
import org.createyourevent.app.repository.OrganizationRepository;
import org.createyourevent.app.service.OrganizationExtService;
import org.createyourevent.app.service.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Organization}.
 */
@Service
@Transactional
public class OrganizationExtServiceImpl implements OrganizationExtService {

    private final Logger log = LoggerFactory.getLogger(OrganizationExtServiceImpl.class);

    private final OrganizationExtRepository organizationExtRepository;

    public OrganizationExtServiceImpl(OrganizationExtRepository organizationExtRepository) {
        this.organizationExtRepository = organizationExtRepository;
    }

    @Override
    public List<Organization> findByUserIdAndActiveTrue(String userId) {
        log.debug("Request to get all Organizations from a user with active=true");
        return organizationExtRepository.findByUserIdAndActiveTrue(userId);
    }

    @Override
    public List<Organization> findByCurrentUser() {
        log.debug("Request to get all Organizations from active user");
        return organizationExtRepository.findByCurrentUserAndActive();
    }

    @Override
    public List<Organization> findByOrganizationType(OrganizationType productType) {
        log.debug("Find all organizations by its Productcategory");
        List<Organization> result = organizationExtRepository.findByOrganizationType(productType);
        return result;
    }

    @Override
    public List<Organization> findByActiveTrue() {
        log.debug("Find all organizations by active=true");
        return organizationExtRepository.findByActiveTrue();
    }

    public List<Organization> findByActiveTrueAndActiveOwnerTrue() {
        log.debug("Find all organizations by active=true and activeOwner = true");
        return organizationExtRepository.findByActiveTrueAndActiveOwnerTrue();
    }

    @Override
    public List<Organization> findByOrganizationTypeAndActiveTrueAndActiveOwner(OrganizationType productType) {
        log.debug("Find all organizations by its Productcategory and active=true");
        List<Organization> result = organizationExtRepository.findByOrganizationTypeAndActiveTrueAndActiveOwnerTrue(productType);
        return result;
    }

}
