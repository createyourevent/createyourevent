package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.EventStarRating;
import org.createyourevent.app.repository.EventStarRatingRepository;
import org.createyourevent.app.service.EventStarRatingService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.EventStarRating}.
 */
@RestController
@RequestMapping("/api")
public class EventStarRatingResource {

    private final Logger log = LoggerFactory.getLogger(EventStarRatingResource.class);

    private static final String ENTITY_NAME = "eventStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventStarRatingService eventStarRatingService;

    private final EventStarRatingRepository eventStarRatingRepository;

    public EventStarRatingResource(EventStarRatingService eventStarRatingService, EventStarRatingRepository eventStarRatingRepository) {
        this.eventStarRatingService = eventStarRatingService;
        this.eventStarRatingRepository = eventStarRatingRepository;
    }

    /**
     * {@code POST  /event-star-ratings} : Create a new eventStarRating.
     *
     * @param eventStarRating the eventStarRating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventStarRating, or with status {@code 400 (Bad Request)} if the eventStarRating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-star-ratings")
    public ResponseEntity<EventStarRating> createEventStarRating(@RequestBody EventStarRating eventStarRating) throws URISyntaxException {
        log.debug("REST request to save EventStarRating : {}", eventStarRating);
        if (eventStarRating.getId() != null) {
            throw new BadRequestAlertException("A new eventStarRating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventStarRating result = eventStarRatingService.save(eventStarRating);
        return ResponseEntity
            .created(new URI("/api/event-star-ratings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-star-ratings/:id} : Updates an existing eventStarRating.
     *
     * @param id the id of the eventStarRating to save.
     * @param eventStarRating the eventStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventStarRating,
     * or with status {@code 400 (Bad Request)} if the eventStarRating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-star-ratings/{id}")
    public ResponseEntity<EventStarRating> updateEventStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventStarRating eventStarRating
    ) throws URISyntaxException {
        log.debug("REST request to update EventStarRating : {}, {}", id, eventStarRating);
        if (eventStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventStarRating result = eventStarRatingService.save(eventStarRating);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventStarRating.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-star-ratings/:id} : Partial updates given fields of an existing eventStarRating, field will ignore if it is null
     *
     * @param id the id of the eventStarRating to save.
     * @param eventStarRating the eventStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventStarRating,
     * or with status {@code 400 (Bad Request)} if the eventStarRating is not valid,
     * or with status {@code 404 (Not Found)} if the eventStarRating is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-star-ratings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventStarRating> partialUpdateEventStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventStarRating eventStarRating
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventStarRating partially : {}, {}", id, eventStarRating);
        if (eventStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventStarRating> result = eventStarRatingService.partialUpdate(eventStarRating);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventStarRating.getId().toString())
        );
    }

    /**
     * {@code GET  /event-star-ratings} : get all the eventStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventStarRatings in body.
     */
    @GetMapping("/event-star-ratings")
    public ResponseEntity<List<EventStarRating>> getAllEventStarRatings(Pageable pageable) {
        log.debug("REST request to get a page of EventStarRatings");
        Page<EventStarRating> page = eventStarRatingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-star-ratings/:id} : get the "id" eventStarRating.
     *
     * @param id the id of the eventStarRating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventStarRating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-star-ratings/{id}")
    public ResponseEntity<EventStarRating> getEventStarRating(@PathVariable Long id) {
        log.debug("REST request to get EventStarRating : {}", id);
        Optional<EventStarRating> eventStarRating = eventStarRatingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventStarRating);
    }

    /**
     * {@code DELETE  /event-star-ratings/:id} : delete the "id" eventStarRating.
     *
     * @param id the id of the eventStarRating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-star-ratings/{id}")
    public ResponseEntity<Void> deleteEventStarRating(@PathVariable Long id) {
        log.debug("REST request to delete EventStarRating : {}", id);
        eventStarRatingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
