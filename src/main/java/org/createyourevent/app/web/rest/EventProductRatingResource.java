package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.EventProductRating;
import org.createyourevent.app.repository.EventProductRatingRepository;
import org.createyourevent.app.service.EventProductRatingService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.EventProductRating}.
 */
@RestController
@RequestMapping("/api")
public class EventProductRatingResource {

    private final Logger log = LoggerFactory.getLogger(EventProductRatingResource.class);

    private static final String ENTITY_NAME = "eventProductRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventProductRatingService eventProductRatingService;

    private final EventProductRatingRepository eventProductRatingRepository;

    public EventProductRatingResource(
        EventProductRatingService eventProductRatingService,
        EventProductRatingRepository eventProductRatingRepository
    ) {
        this.eventProductRatingService = eventProductRatingService;
        this.eventProductRatingRepository = eventProductRatingRepository;
    }

    /**
     * {@code POST  /event-product-ratings} : Create a new eventProductRating.
     *
     * @param eventProductRating the eventProductRating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventProductRating, or with status {@code 400 (Bad Request)} if the eventProductRating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-product-ratings")
    public ResponseEntity<EventProductRating> createEventProductRating(@RequestBody EventProductRating eventProductRating)
        throws URISyntaxException {
        log.debug("REST request to save EventProductRating : {}", eventProductRating);
        if (eventProductRating.getId() != null) {
            throw new BadRequestAlertException("A new eventProductRating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventProductRating result = eventProductRatingService.save(eventProductRating);
        return ResponseEntity
            .created(new URI("/api/event-product-ratings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-product-ratings/:id} : Updates an existing eventProductRating.
     *
     * @param id the id of the eventProductRating to save.
     * @param eventProductRating the eventProductRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventProductRating,
     * or with status {@code 400 (Bad Request)} if the eventProductRating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventProductRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-product-ratings/{id}")
    public ResponseEntity<EventProductRating> updateEventProductRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventProductRating eventProductRating
    ) throws URISyntaxException {
        log.debug("REST request to update EventProductRating : {}, {}", id, eventProductRating);
        if (eventProductRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventProductRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventProductRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventProductRating result = eventProductRatingService.save(eventProductRating);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventProductRating.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-product-ratings/:id} : Partial updates given fields of an existing eventProductRating, field will ignore if it is null
     *
     * @param id the id of the eventProductRating to save.
     * @param eventProductRating the eventProductRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventProductRating,
     * or with status {@code 400 (Bad Request)} if the eventProductRating is not valid,
     * or with status {@code 404 (Not Found)} if the eventProductRating is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventProductRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-product-ratings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventProductRating> partialUpdateEventProductRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventProductRating eventProductRating
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventProductRating partially : {}, {}", id, eventProductRating);
        if (eventProductRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventProductRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventProductRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventProductRating> result = eventProductRatingService.partialUpdate(eventProductRating);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventProductRating.getId().toString())
        );
    }

    /**
     * {@code GET  /event-product-ratings} : get all the eventProductRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventProductRatings in body.
     */
    @GetMapping("/event-product-ratings")
    public ResponseEntity<List<EventProductRating>> getAllEventProductRatings(Pageable pageable) {
        log.debug("REST request to get a page of EventProductRatings");
        Page<EventProductRating> page = eventProductRatingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-product-ratings/:id} : get the "id" eventProductRating.
     *
     * @param id the id of the eventProductRating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventProductRating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-product-ratings/{id}")
    public ResponseEntity<EventProductRating> getEventProductRating(@PathVariable Long id) {
        log.debug("REST request to get EventProductRating : {}", id);
        Optional<EventProductRating> eventProductRating = eventProductRatingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventProductRating);
    }

    /**
     * {@code DELETE  /event-product-ratings/:id} : delete the "id" eventProductRating.
     *
     * @param id the id of the eventProductRating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-product-ratings/{id}")
    public ResponseEntity<Void> deleteEventProductRating(@PathVariable Long id) {
        log.debug("REST request to delete EventProductRating : {}", id);
        eventProductRatingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
