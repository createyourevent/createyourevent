package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.OrganizationReservation;
import org.createyourevent.app.repository.OrganizationReservationRepository;
import org.createyourevent.app.service.OrganizationReservationService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.OrganizationReservation}.
 */
@RestController
@RequestMapping("/api")
public class OrganizationReservationResource {

    private final Logger log = LoggerFactory.getLogger(OrganizationReservationResource.class);

    private static final String ENTITY_NAME = "organizationReservation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizationReservationService organizationReservationService;

    private final OrganizationReservationRepository organizationReservationRepository;

    public OrganizationReservationResource(
        OrganizationReservationService organizationReservationService,
        OrganizationReservationRepository organizationReservationRepository
    ) {
        this.organizationReservationService = organizationReservationService;
        this.organizationReservationRepository = organizationReservationRepository;
    }

    /**
     * {@code POST  /organization-reservations} : Create a new organizationReservation.
     *
     * @param organizationReservation the organizationReservation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organizationReservation, or with status {@code 400 (Bad Request)} if the organizationReservation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/organization-reservations")
    public ResponseEntity<OrganizationReservation> createOrganizationReservation(
        @RequestBody OrganizationReservation organizationReservation
    ) throws URISyntaxException {
        log.debug("REST request to save OrganizationReservation : {}", organizationReservation);
        if (organizationReservation.getId() != null) {
            throw new BadRequestAlertException("A new organizationReservation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrganizationReservation result = organizationReservationService.save(organizationReservation);
        return ResponseEntity
            .created(new URI("/api/organization-reservations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /organization-reservations/:id} : Updates an existing organizationReservation.
     *
     * @param id the id of the organizationReservation to save.
     * @param organizationReservation the organizationReservation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organizationReservation,
     * or with status {@code 400 (Bad Request)} if the organizationReservation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the organizationReservation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/organization-reservations/{id}")
    public ResponseEntity<OrganizationReservation> updateOrganizationReservation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrganizationReservation organizationReservation
    ) throws URISyntaxException {
        log.debug("REST request to update OrganizationReservation : {}, {}", id, organizationReservation);
        if (organizationReservation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organizationReservation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organizationReservationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrganizationReservation result = organizationReservationService.save(organizationReservation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organizationReservation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /organization-reservations/:id} : Partial updates given fields of an existing organizationReservation, field will ignore if it is null
     *
     * @param id the id of the organizationReservation to save.
     * @param organizationReservation the organizationReservation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organizationReservation,
     * or with status {@code 400 (Bad Request)} if the organizationReservation is not valid,
     * or with status {@code 404 (Not Found)} if the organizationReservation is not found,
     * or with status {@code 500 (Internal Server Error)} if the organizationReservation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/organization-reservations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrganizationReservation> partialUpdateOrganizationReservation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrganizationReservation organizationReservation
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrganizationReservation partially : {}, {}", id, organizationReservation);
        if (organizationReservation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organizationReservation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organizationReservationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrganizationReservation> result = organizationReservationService.partialUpdate(organizationReservation);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organizationReservation.getId().toString())
        );
    }

    /**
     * {@code GET  /organization-reservations} : get all the organizationReservations.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organizationReservations in body.
     */
    @GetMapping("/organization-reservations")
    public ResponseEntity<List<OrganizationReservation>> getAllOrganizationReservations(
        Pageable pageable,
        @RequestParam(required = false) String filter
    ) {
        if ("feetransaction-is-null".equals(filter)) {
            log.debug("REST request to get all OrganizationReservations where feeTransaction is null");
            return new ResponseEntity<>(organizationReservationService.findAllWhereFeeTransactionIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of OrganizationReservations");
        Page<OrganizationReservation> page = organizationReservationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /organization-reservations/:id} : get the "id" organizationReservation.
     *
     * @param id the id of the organizationReservation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organizationReservation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organization-reservations/{id}")
    public ResponseEntity<OrganizationReservation> getOrganizationReservation(@PathVariable Long id) {
        log.debug("REST request to get OrganizationReservation : {}", id);
        Optional<OrganizationReservation> organizationReservation = organizationReservationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(organizationReservation);
    }

    /**
     * {@code DELETE  /organization-reservations/:id} : delete the "id" organizationReservation.
     *
     * @param id the id of the organizationReservation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/organization-reservations/{id}")
    public ResponseEntity<Void> deleteOrganizationReservation(@PathVariable Long id) {
        log.debug("REST request to delete OrganizationReservation : {}", id);
        organizationReservationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
