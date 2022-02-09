package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.EventDetails;
import org.createyourevent.app.repository.EventDetailsRepository;
import org.createyourevent.app.service.EventDetailsService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.EventDetails}.
 */
@RestController
@RequestMapping("/api")
public class EventDetailsResource {

    private final Logger log = LoggerFactory.getLogger(EventDetailsResource.class);

    private static final String ENTITY_NAME = "eventDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventDetailsService eventDetailsService;

    private final EventDetailsRepository eventDetailsRepository;

    public EventDetailsResource(EventDetailsService eventDetailsService, EventDetailsRepository eventDetailsRepository) {
        this.eventDetailsService = eventDetailsService;
        this.eventDetailsRepository = eventDetailsRepository;
    }

    /**
     * {@code POST  /event-details} : Create a new eventDetails.
     *
     * @param eventDetails the eventDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventDetails, or with status {@code 400 (Bad Request)} if the eventDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-details")
    public ResponseEntity<EventDetails> createEventDetails(@RequestBody EventDetails eventDetails) throws URISyntaxException {
        log.debug("REST request to save EventDetails : {}", eventDetails);
        if (eventDetails.getId() != null) {
            throw new BadRequestAlertException("A new eventDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventDetails result = eventDetailsService.save(eventDetails);
        return ResponseEntity
            .created(new URI("/api/event-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-details/:id} : Updates an existing eventDetails.
     *
     * @param id the id of the eventDetails to save.
     * @param eventDetails the eventDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventDetails,
     * or with status {@code 400 (Bad Request)} if the eventDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-details/{id}")
    public ResponseEntity<EventDetails> updateEventDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventDetails eventDetails
    ) throws URISyntaxException {
        log.debug("REST request to update EventDetails : {}, {}", id, eventDetails);
        if (eventDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventDetails result = eventDetailsService.save(eventDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-details/:id} : Partial updates given fields of an existing eventDetails, field will ignore if it is null
     *
     * @param id the id of the eventDetails to save.
     * @param eventDetails the eventDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventDetails,
     * or with status {@code 400 (Bad Request)} if the eventDetails is not valid,
     * or with status {@code 404 (Not Found)} if the eventDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventDetails> partialUpdateEventDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventDetails eventDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventDetails partially : {}, {}", id, eventDetails);
        if (eventDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventDetails> result = eventDetailsService.partialUpdate(eventDetails);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /event-details} : get all the eventDetails.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventDetails in body.
     */
    @GetMapping("/event-details")
    public ResponseEntity<List<EventDetails>> getAllEventDetails(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("event-is-null".equals(filter)) {
            log.debug("REST request to get all EventDetailss where event is null");
            return new ResponseEntity<>(eventDetailsService.findAllWhereEventIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of EventDetails");
        Page<EventDetails> page = eventDetailsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-details/:id} : get the "id" eventDetails.
     *
     * @param id the id of the eventDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-details/{id}")
    public ResponseEntity<EventDetails> getEventDetails(@PathVariable Long id) {
        log.debug("REST request to get EventDetails : {}", id);
        Optional<EventDetails> eventDetails = eventDetailsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventDetails);
    }

    /**
     * {@code DELETE  /event-details/:id} : delete the "id" eventDetails.
     *
     * @param id the id of the eventDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-details/{id}")
    public ResponseEntity<Void> deleteEventDetails(@PathVariable Long id) {
        log.debug("REST request to delete EventDetails : {}", id);
        eventDetailsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
