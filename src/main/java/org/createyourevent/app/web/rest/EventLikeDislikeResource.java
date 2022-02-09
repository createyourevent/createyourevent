package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.EventLikeDislike;
import org.createyourevent.app.repository.EventLikeDislikeRepository;
import org.createyourevent.app.service.EventLikeDislikeService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.EventLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class EventLikeDislikeResource {

    private final Logger log = LoggerFactory.getLogger(EventLikeDislikeResource.class);

    private static final String ENTITY_NAME = "eventLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventLikeDislikeService eventLikeDislikeService;

    private final EventLikeDislikeRepository eventLikeDislikeRepository;

    public EventLikeDislikeResource(
        EventLikeDislikeService eventLikeDislikeService,
        EventLikeDislikeRepository eventLikeDislikeRepository
    ) {
        this.eventLikeDislikeService = eventLikeDislikeService;
        this.eventLikeDislikeRepository = eventLikeDislikeRepository;
    }

    /**
     * {@code POST  /event-like-dislikes} : Create a new eventLikeDislike.
     *
     * @param eventLikeDislike the eventLikeDislike to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventLikeDislike, or with status {@code 400 (Bad Request)} if the eventLikeDislike has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-like-dislikes")
    public ResponseEntity<EventLikeDislike> createEventLikeDislike(@RequestBody EventLikeDislike eventLikeDislike)
        throws URISyntaxException {
        log.debug("REST request to save EventLikeDislike : {}", eventLikeDislike);
        if (eventLikeDislike.getId() != null) {
            throw new BadRequestAlertException("A new eventLikeDislike cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventLikeDislike result = eventLikeDislikeService.save(eventLikeDislike);
        return ResponseEntity
            .created(new URI("/api/event-like-dislikes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-like-dislikes/:id} : Updates an existing eventLikeDislike.
     *
     * @param id the id of the eventLikeDislike to save.
     * @param eventLikeDislike the eventLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventLikeDislike,
     * or with status {@code 400 (Bad Request)} if the eventLikeDislike is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-like-dislikes/{id}")
    public ResponseEntity<EventLikeDislike> updateEventLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventLikeDislike eventLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to update EventLikeDislike : {}, {}", id, eventLikeDislike);
        if (eventLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventLikeDislike result = eventLikeDislikeService.save(eventLikeDislike);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventLikeDislike.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-like-dislikes/:id} : Partial updates given fields of an existing eventLikeDislike, field will ignore if it is null
     *
     * @param id the id of the eventLikeDislike to save.
     * @param eventLikeDislike the eventLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventLikeDislike,
     * or with status {@code 400 (Bad Request)} if the eventLikeDislike is not valid,
     * or with status {@code 404 (Not Found)} if the eventLikeDislike is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-like-dislikes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventLikeDislike> partialUpdateEventLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventLikeDislike eventLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventLikeDislike partially : {}, {}", id, eventLikeDislike);
        if (eventLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventLikeDislike> result = eventLikeDislikeService.partialUpdate(eventLikeDislike);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventLikeDislike.getId().toString())
        );
    }

    /**
     * {@code GET  /event-like-dislikes} : get all the eventLikeDislikes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventLikeDislikes in body.
     */
    @GetMapping("/event-like-dislikes")
    public ResponseEntity<List<EventLikeDislike>> getAllEventLikeDislikes(Pageable pageable) {
        log.debug("REST request to get a page of EventLikeDislikes");
        Page<EventLikeDislike> page = eventLikeDislikeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-like-dislikes/:id} : get the "id" eventLikeDislike.
     *
     * @param id the id of the eventLikeDislike to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventLikeDislike, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-like-dislikes/{id}")
    public ResponseEntity<EventLikeDislike> getEventLikeDislike(@PathVariable Long id) {
        log.debug("REST request to get EventLikeDislike : {}", id);
        Optional<EventLikeDislike> eventLikeDislike = eventLikeDislikeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventLikeDislike);
    }

    /**
     * {@code DELETE  /event-like-dislikes/:id} : delete the "id" eventLikeDislike.
     *
     * @param id the id of the eventLikeDislike to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-like-dislikes/{id}")
    public ResponseEntity<Void> deleteEventLikeDislike(@PathVariable Long id) {
        log.debug("REST request to delete EventLikeDislike : {}", id);
        eventLikeDislikeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
