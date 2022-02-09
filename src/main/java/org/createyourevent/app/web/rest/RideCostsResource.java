package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.createyourevent.app.domain.RideCosts;
import org.createyourevent.app.repository.RideCostsRepository;
import org.createyourevent.app.service.RideCostsService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.RideCosts}.
 */
@RestController
@RequestMapping("/api")
public class RideCostsResource {

    private final Logger log = LoggerFactory.getLogger(RideCostsResource.class);

    private static final String ENTITY_NAME = "rideCosts";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RideCostsService rideCostsService;

    private final RideCostsRepository rideCostsRepository;

    public RideCostsResource(RideCostsService rideCostsService, RideCostsRepository rideCostsRepository) {
        this.rideCostsService = rideCostsService;
        this.rideCostsRepository = rideCostsRepository;
    }

    /**
     * {@code POST  /ride-costs} : Create a new rideCosts.
     *
     * @param rideCosts the rideCosts to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rideCosts, or with status {@code 400 (Bad Request)} if the rideCosts has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ride-costs")
    public ResponseEntity<RideCosts> createRideCosts(@Valid @RequestBody RideCosts rideCosts) throws URISyntaxException {
        log.debug("REST request to save RideCosts : {}", rideCosts);
        if (rideCosts.getId() != null) {
            throw new BadRequestAlertException("A new rideCosts cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RideCosts result = rideCostsService.save(rideCosts);
        return ResponseEntity
            .created(new URI("/api/ride-costs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ride-costs/:id} : Updates an existing rideCosts.
     *
     * @param id the id of the rideCosts to save.
     * @param rideCosts the rideCosts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rideCosts,
     * or with status {@code 400 (Bad Request)} if the rideCosts is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rideCosts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ride-costs/{id}")
    public ResponseEntity<RideCosts> updateRideCosts(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RideCosts rideCosts
    ) throws URISyntaxException {
        log.debug("REST request to update RideCosts : {}, {}", id, rideCosts);
        if (rideCosts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rideCosts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rideCostsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RideCosts result = rideCostsService.save(rideCosts);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rideCosts.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ride-costs/:id} : Partial updates given fields of an existing rideCosts, field will ignore if it is null
     *
     * @param id the id of the rideCosts to save.
     * @param rideCosts the rideCosts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rideCosts,
     * or with status {@code 400 (Bad Request)} if the rideCosts is not valid,
     * or with status {@code 404 (Not Found)} if the rideCosts is not found,
     * or with status {@code 500 (Internal Server Error)} if the rideCosts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ride-costs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RideCosts> partialUpdateRideCosts(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RideCosts rideCosts
    ) throws URISyntaxException {
        log.debug("REST request to partial update RideCosts partially : {}, {}", id, rideCosts);
        if (rideCosts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rideCosts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rideCostsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RideCosts> result = rideCostsService.partialUpdate(rideCosts);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rideCosts.getId().toString())
        );
    }

    /**
     * {@code GET  /ride-costs} : get all the rideCosts.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rideCosts in body.
     */
    @GetMapping("/ride-costs")
    public ResponseEntity<List<RideCosts>> getAllRideCosts(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("servicemap-is-null".equals(filter)) {
            log.debug("REST request to get all RideCostss where serviceMap is null");
            return new ResponseEntity<>(rideCostsService.findAllWhereServiceMapIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of RideCosts");
        Page<RideCosts> page = rideCostsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /ride-costs/:id} : get the "id" rideCosts.
     *
     * @param id the id of the rideCosts to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rideCosts, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ride-costs/{id}")
    public ResponseEntity<RideCosts> getRideCosts(@PathVariable Long id) {
        log.debug("REST request to get RideCosts : {}", id);
        Optional<RideCosts> rideCosts = rideCostsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(rideCosts);
    }

    /**
     * {@code DELETE  /ride-costs/:id} : delete the "id" rideCosts.
     *
     * @param id the id of the rideCosts to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ride-costs/{id}")
    public ResponseEntity<Void> deleteRideCosts(@PathVariable Long id) {
        log.debug("REST request to delete RideCosts : {}", id);
        rideCostsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
