package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.EventComment;
import org.createyourevent.app.repository.EventCommentRepository;
import org.createyourevent.app.service.EventCommentService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.EventComment}.
 */
@RestController
@RequestMapping("/api")
public class EventCommentResource {

    private final Logger log = LoggerFactory.getLogger(EventCommentResource.class);

    private static final String ENTITY_NAME = "eventComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventCommentService eventCommentService;

    private final EventCommentRepository eventCommentRepository;

    public EventCommentResource(EventCommentService eventCommentService, EventCommentRepository eventCommentRepository) {
        this.eventCommentService = eventCommentService;
        this.eventCommentRepository = eventCommentRepository;
    }

    /**
     * {@code POST  /event-comments} : Create a new eventComment.
     *
     * @param eventComment the eventComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventComment, or with status {@code 400 (Bad Request)} if the eventComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-comments")
    public ResponseEntity<EventComment> createEventComment(@RequestBody EventComment eventComment) throws URISyntaxException {
        log.debug("REST request to save EventComment : {}", eventComment);
        if (eventComment.getId() != null) {
            throw new BadRequestAlertException("A new eventComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventComment result = eventCommentService.save(eventComment);
        return ResponseEntity
            .created(new URI("/api/event-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-comments/:id} : Updates an existing eventComment.
     *
     * @param id the id of the eventComment to save.
     * @param eventComment the eventComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventComment,
     * or with status {@code 400 (Bad Request)} if the eventComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-comments/{id}")
    public ResponseEntity<EventComment> updateEventComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventComment eventComment
    ) throws URISyntaxException {
        log.debug("REST request to update EventComment : {}, {}", id, eventComment);
        if (eventComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventComment result = eventCommentService.save(eventComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-comments/:id} : Partial updates given fields of an existing eventComment, field will ignore if it is null
     *
     * @param id the id of the eventComment to save.
     * @param eventComment the eventComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventComment,
     * or with status {@code 400 (Bad Request)} if the eventComment is not valid,
     * or with status {@code 404 (Not Found)} if the eventComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventComment> partialUpdateEventComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventComment eventComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventComment partially : {}, {}", id, eventComment);
        if (eventComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventComment> result = eventCommentService.partialUpdate(eventComment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventComment.getId().toString())
        );
    }

    /**
     * {@code GET  /event-comments} : get all the eventComments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventComments in body.
     */
    @GetMapping("/event-comments")
    public ResponseEntity<List<EventComment>> getAllEventComments(Pageable pageable) {
        log.debug("REST request to get a page of EventComments");
        Page<EventComment> page = eventCommentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-comments/:id} : get the "id" eventComment.
     *
     * @param id the id of the eventComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-comments/{id}")
    public ResponseEntity<EventComment> getEventComment(@PathVariable Long id) {
        log.debug("REST request to get EventComment : {}", id);
        Optional<EventComment> eventComment = eventCommentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventComment);
    }

    /**
     * {@code DELETE  /event-comments/:id} : delete the "id" eventComment.
     *
     * @param id the id of the eventComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-comments/{id}")
    public ResponseEntity<Void> deleteEventComment(@PathVariable Long id) {
        log.debug("REST request to delete EventComment : {}", id);
        eventCommentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
