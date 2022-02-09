package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.createyourevent.app.domain.Organization;
import org.createyourevent.app.domain.User;
import org.createyourevent.app.domain.enumeration.OrganizationType;
import org.createyourevent.app.repository.OrganizationExtRepository;
import org.createyourevent.app.repository.OrganizationRepository;
import org.createyourevent.app.service.OrganizationExtService;
import org.createyourevent.app.service.OrganizationService;
import org.createyourevent.app.service.UserService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourevent.app.domain.Organization}.
 */
@RestController
@RequestMapping("/api")
public class OrganizationExtResource {

    private final Logger log = LoggerFactory.getLogger(OrganizationExtResource.class);

    private static final String ENTITY_NAME = "organization";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizationExtService organizationExtService;

    private final OrganizationExtRepository organizationExtRepository;

    private final UserService userService;

    private final OrganizationService organizationService;

    public OrganizationExtResource(OrganizationService organizationService, UserService userService, OrganizationExtService organizationExtService, OrganizationExtRepository organizationExtRepository) {
        this.organizationExtService = organizationExtService;
        this.organizationExtRepository = organizationExtRepository;
        this.organizationService = organizationService;
        this.userService = userService;
    }

/**
     * {@code GET  /organizations/:userId/active} : get the "userId" organization with active=true.
     *
     * @param userId the userId of the organization to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organizations, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organizations/user/active")
    public List<Organization> getOrganizationsFromUserAndActiveOrganization() {
        log.debug("REST request to get Organization from user and active");
        List<Organization> organizations = organizationExtService.findByCurrentUser();
        return organizations;
    }

    @GetMapping("/organizations/{userId}/active")
    public List<Organization> getOrganizationsFromUserIdAndActiveOrganization(@PathVariable String userId) {
        log.debug("REST request to get Organization from user and active");
        List<Organization> organizations = organizationExtService.findByUserIdAndActiveTrue(userId);
        return organizations;
    }

       /**
     * {@code POST  /organizations} : Create a new organization.
     *
     * @param organization the organization to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organization, or with status {@code 400 (Bad Request)} if the organization has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/organizations/user")
    public ResponseEntity<Organization> createOrganization(@Valid @RequestBody Organization organization) throws URISyntaxException {
        log.debug("REST request to save Organization : {}", organization);
        final Optional<User> isUser = userService.getUserWithAuthorities();
        if(!isUser.isPresent()) {
        log.error("User is not logged in");
        }
        final User user = isUser.get();
        organization.setUser(user);
        if (organization.getId() != null) {
            throw new BadRequestAlertException("A new organization cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Organization result = organizationService.save(organization);
        return ResponseEntity.created(new URI("/api/organizations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

        /**
     * {@code GET  /organizations/user/current} : get the "userId" organization with active=true.
     *
     * @param userId the userId of the organization to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organizations, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organizations/user/current")
    public List<Organization> getOrganizationsFromActiveUser() {
        log.debug("REST request to get Organization from active user");
        List<Organization> organizations = organizationExtService.findByCurrentUser();
        return organizations;
    }

    @GetMapping("/organizations/{type}/producttype")
    public List<Organization> getOrganizationsWithProductTypeAndActive(@PathVariable OrganizationType type) {
        log.debug("REST request to get Organization with organization type");
        List<Organization> organizations = organizationExtService.findByOrganizationTypeAndActiveTrueAndActiveOwner(type);
        return organizations;
    }

    @GetMapping("/organizations/active")
    public List<Organization> getOrganizationsWithActiveTrue() {
        log.debug("REST request to get Organization with active=true");
        List<Organization> organizations = organizationExtService.findByActiveTrue();
        return organizations;
    }

    @GetMapping("/organizations/active/activeOwner")
    public List<Organization> getOrganizationsWithActiveTrueAndActiveOwnerTrue() {
        log.debug("REST request to get Organization with active=true");
        List<Organization> organizations = organizationExtService.findByActiveTrueAndActiveOwnerTrue();
        return organizations;
    }
}
