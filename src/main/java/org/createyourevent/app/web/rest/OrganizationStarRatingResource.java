package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationStarRating;
import org.createyourevent.app.repository.OrganizationStarRatingRepository;
import org.createyourevent.app.service.OrganizationStarRatingService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.OrganizationStarRating}.
 */
@RestController
@RequestMapping("/api")
public class OrganizationStarRatingResource {

    private final Logger log = LoggerFactory.getLogger(OrganizationStarRatingResource.class);

    private static final String ENTITY_NAME = "organizationStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizationStarRatingService organizationStarRatingService;

    private final OrganizationStarRatingRepository organizationStarRatingRepository;

    public OrganizationStarRatingResource(
        OrganizationStarRatingService organizationStarRatingService,
        OrganizationStarRatingRepository organizationStarRatingRepository
    ) {
        this.organizationStarRatingService = organizationStarRatingService;
        this.organizationStarRatingRepository = organizationStarRatingRepository;
    }

    /**
     * {@code POST  /organization-star-ratings} : Create a new organizationStarRating.
     *
     * @param organizationStarRating the organizationStarRating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organizationStarRating, or with status {@code 400 (Bad Request)} if the organizationStarRating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/organization-star-ratings")
    public ResponseEntity<OrganizationStarRating> createOrganizationStarRating(@RequestBody OrganizationStarRating organizationStarRating)
        throws URISyntaxException {
        log.debug("REST request to save OrganizationStarRating : {}", organizationStarRating);
        if (organizationStarRating.getId() != null) {
            throw new BadRequestAlertException("A new organizationStarRating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrganizationStarRating result = organizationStarRatingService.save(organizationStarRating);
        return ResponseEntity
            .created(new URI("/api/organization-star-ratings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /organization-star-ratings/:id} : Updates an existing organizationStarRating.
     *
     * @param id the id of the organizationStarRating to save.
     * @param organizationStarRating the organizationStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organizationStarRating,
     * or with status {@code 400 (Bad Request)} if the organizationStarRating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the organizationStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/organization-star-ratings/{id}")
    public ResponseEntity<OrganizationStarRating> updateOrganizationStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrganizationStarRating organizationStarRating
    ) throws URISyntaxException {
        log.debug("REST request to update OrganizationStarRating : {}, {}", id, organizationStarRating);
        if (organizationStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organizationStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organizationStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrganizationStarRating result = organizationStarRatingService.save(organizationStarRating);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organizationStarRating.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /organization-star-ratings/:id} : Partial updates given fields of an existing organizationStarRating, field will ignore if it is null
     *
     * @param id the id of the organizationStarRating to save.
     * @param organizationStarRating the organizationStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organizationStarRating,
     * or with status {@code 400 (Bad Request)} if the organizationStarRating is not valid,
     * or with status {@code 404 (Not Found)} if the organizationStarRating is not found,
     * or with status {@code 500 (Internal Server Error)} if the organizationStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/organization-star-ratings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrganizationStarRating> partialUpdateOrganizationStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrganizationStarRating organizationStarRating
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrganizationStarRating partially : {}, {}", id, organizationStarRating);
        if (organizationStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organizationStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organizationStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrganizationStarRating> result = organizationStarRatingService.partialUpdate(organizationStarRating);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organizationStarRating.getId().toString())
        );
    }

    /**
     * {@code GET  /organization-star-ratings} : get all the organizationStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organizationStarRatings in body.
     */
    @GetMapping("/organization-star-ratings")
    public ResponseEntity<List<OrganizationStarRating>> getAllOrganizationStarRatings(Pageable pageable) {
        log.debug("REST request to get a page of OrganizationStarRatings");
        Page<OrganizationStarRating> page = organizationStarRatingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /organization-star-ratings/:id} : get the "id" organizationStarRating.
     *
     * @param id the id of the organizationStarRating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organizationStarRating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organization-star-ratings/{id}")
    public ResponseEntity<OrganizationStarRating> getOrganizationStarRating(@PathVariable Long id) {
        log.debug("REST request to get OrganizationStarRating : {}", id);
        Optional<OrganizationStarRating> organizationStarRating = organizationStarRatingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(organizationStarRating);
    }

    /**
     * {@code DELETE  /organization-star-ratings/:id} : delete the "id" organizationStarRating.
     *
     * @param id the id of the organizationStarRating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/organization-star-ratings/{id}")
    public ResponseEntity<Void> deleteOrganizationStarRating(@PathVariable Long id) {
        log.debug("REST request to delete OrganizationStarRating : {}", id);
        organizationStarRatingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
