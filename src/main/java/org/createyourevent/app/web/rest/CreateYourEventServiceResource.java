package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.createyourevent.app.domain.CreateYourEventService;
import org.createyourevent.app.repository.CreateYourEventServiceRepository;
import org.createyourevent.app.service.CreateYourEventServiceService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.CreateYourEventService}.
 */
@RestController
@RequestMapping("/api")
public class CreateYourEventServiceResource {

    private final Logger log = LoggerFactory.getLogger(CreateYourEventServiceResource.class);

    private static final String ENTITY_NAME = "createYourEventService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CreateYourEventServiceService createYourEventServiceService;

    private final CreateYourEventServiceRepository createYourEventServiceRepository;

    public CreateYourEventServiceResource(
        CreateYourEventServiceService createYourEventServiceService,
        CreateYourEventServiceRepository createYourEventServiceRepository
    ) {
        this.createYourEventServiceService = createYourEventServiceService;
        this.createYourEventServiceRepository = createYourEventServiceRepository;
    }

    /**
     * {@code POST  /create-your-event-services} : Create a new createYourEventService.
     *
     * @param createYourEventService the createYourEventService to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new createYourEventService, or with status {@code 400 (Bad Request)} if the createYourEventService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/create-your-event-services")
    public ResponseEntity<CreateYourEventService> createCreateYourEventService(
        @Valid @RequestBody CreateYourEventService createYourEventService
    ) throws URISyntaxException {
        log.debug("REST request to save CreateYourEventService : {}", createYourEventService);
        if (createYourEventService.getId() != null) {
            throw new BadRequestAlertException("A new createYourEventService cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CreateYourEventService result = createYourEventServiceService.save(createYourEventService);
        return ResponseEntity
            .created(new URI("/api/create-your-event-services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /create-your-event-services/:id} : Updates an existing createYourEventService.
     *
     * @param id the id of the createYourEventService to save.
     * @param createYourEventService the createYourEventService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated createYourEventService,
     * or with status {@code 400 (Bad Request)} if the createYourEventService is not valid,
     * or with status {@code 500 (Internal Server Error)} if the createYourEventService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/create-your-event-services/{id}")
    public ResponseEntity<CreateYourEventService> updateCreateYourEventService(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CreateYourEventService createYourEventService
    ) throws URISyntaxException {
        log.debug("REST request to update CreateYourEventService : {}, {}", id, createYourEventService);
        if (createYourEventService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, createYourEventService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!createYourEventServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CreateYourEventService result = createYourEventServiceService.save(createYourEventService);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, createYourEventService.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /create-your-event-services/:id} : Partial updates given fields of an existing createYourEventService, field will ignore if it is null
     *
     * @param id the id of the createYourEventService to save.
     * @param createYourEventService the createYourEventService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated createYourEventService,
     * or with status {@code 400 (Bad Request)} if the createYourEventService is not valid,
     * or with status {@code 404 (Not Found)} if the createYourEventService is not found,
     * or with status {@code 500 (Internal Server Error)} if the createYourEventService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/create-your-event-services/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CreateYourEventService> partialUpdateCreateYourEventService(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CreateYourEventService createYourEventService
    ) throws URISyntaxException {
        log.debug("REST request to partial update CreateYourEventService partially : {}, {}", id, createYourEventService);
        if (createYourEventService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, createYourEventService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!createYourEventServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CreateYourEventService> result = createYourEventServiceService.partialUpdate(createYourEventService);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, createYourEventService.getId().toString())
        );
    }

    /**
     * {@code GET  /create-your-event-services} : get all the createYourEventServices.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of createYourEventServices in body.
     */
    @GetMapping("/create-your-event-services")
    public ResponseEntity<List<CreateYourEventService>> getAllCreateYourEventServices(Pageable pageable) {
        log.debug("REST request to get a page of CreateYourEventServices");
        Page<CreateYourEventService> page = createYourEventServiceService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /create-your-event-services/:id} : get the "id" createYourEventService.
     *
     * @param id the id of the createYourEventService to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the createYourEventService, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/create-your-event-services/{id}")
    public ResponseEntity<CreateYourEventService> getCreateYourEventService(@PathVariable Long id) {
        log.debug("REST request to get CreateYourEventService : {}", id);
        Optional<CreateYourEventService> createYourEventService = createYourEventServiceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(createYourEventService);
    }

    /**
     * {@code DELETE  /create-your-event-services/:id} : delete the "id" createYourEventService.
     *
     * @param id the id of the createYourEventService to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/create-your-event-services/{id}")
    public ResponseEntity<Void> deleteCreateYourEventService(@PathVariable Long id) {
        log.debug("REST request to delete CreateYourEventService : {}", id);
        createYourEventServiceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
