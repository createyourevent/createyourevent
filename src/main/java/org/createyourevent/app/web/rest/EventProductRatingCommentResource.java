package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.EventProductRatingComment;
import org.createyourevent.app.repository.EventProductRatingCommentRepository;
import org.createyourevent.app.service.EventProductRatingCommentService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.EventProductRatingComment}.
 */
@RestController
@RequestMapping("/api")
public class EventProductRatingCommentResource {

    private final Logger log = LoggerFactory.getLogger(EventProductRatingCommentResource.class);

    private static final String ENTITY_NAME = "eventProductRatingComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventProductRatingCommentService eventProductRatingCommentService;

    private final EventProductRatingCommentRepository eventProductRatingCommentRepository;

    public EventProductRatingCommentResource(
        EventProductRatingCommentService eventProductRatingCommentService,
        EventProductRatingCommentRepository eventProductRatingCommentRepository
    ) {
        this.eventProductRatingCommentService = eventProductRatingCommentService;
        this.eventProductRatingCommentRepository = eventProductRatingCommentRepository;
    }

    /**
     * {@code POST  /event-product-rating-comments} : Create a new eventProductRatingComment.
     *
     * @param eventProductRatingComment the eventProductRatingComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventProductRatingComment, or with status {@code 400 (Bad Request)} if the eventProductRatingComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-product-rating-comments")
    public ResponseEntity<EventProductRatingComment> createEventProductRatingComment(
        @RequestBody EventProductRatingComment eventProductRatingComment
    ) throws URISyntaxException {
        log.debug("REST request to save EventProductRatingComment : {}", eventProductRatingComment);
        if (eventProductRatingComment.getId() != null) {
            throw new BadRequestAlertException("A new eventProductRatingComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventProductRatingComment result = eventProductRatingCommentService.save(eventProductRatingComment);
        return ResponseEntity
            .created(new URI("/api/event-product-rating-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-product-rating-comments/:id} : Updates an existing eventProductRatingComment.
     *
     * @param id the id of the eventProductRatingComment to save.
     * @param eventProductRatingComment the eventProductRatingComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventProductRatingComment,
     * or with status {@code 400 (Bad Request)} if the eventProductRatingComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventProductRatingComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-product-rating-comments/{id}")
    public ResponseEntity<EventProductRatingComment> updateEventProductRatingComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventProductRatingComment eventProductRatingComment
    ) throws URISyntaxException {
        log.debug("REST request to update EventProductRatingComment : {}, {}", id, eventProductRatingComment);
        if (eventProductRatingComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventProductRatingComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventProductRatingCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventProductRatingComment result = eventProductRatingCommentService.save(eventProductRatingComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventProductRatingComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-product-rating-comments/:id} : Partial updates given fields of an existing eventProductRatingComment, field will ignore if it is null
     *
     * @param id the id of the eventProductRatingComment to save.
     * @param eventProductRatingComment the eventProductRatingComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventProductRatingComment,
     * or with status {@code 400 (Bad Request)} if the eventProductRatingComment is not valid,
     * or with status {@code 404 (Not Found)} if the eventProductRatingComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventProductRatingComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-product-rating-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventProductRatingComment> partialUpdateEventProductRatingComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventProductRatingComment eventProductRatingComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventProductRatingComment partially : {}, {}", id, eventProductRatingComment);
        if (eventProductRatingComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventProductRatingComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventProductRatingCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventProductRatingComment> result = eventProductRatingCommentService.partialUpdate(eventProductRatingComment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventProductRatingComment.getId().toString())
        );
    }

    /**
     * {@code GET  /event-product-rating-comments} : get all the eventProductRatingComments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventProductRatingComments in body.
     */
    @GetMapping("/event-product-rating-comments")
    public ResponseEntity<List<EventProductRatingComment>> getAllEventProductRatingComments(Pageable pageable) {
        log.debug("REST request to get a page of EventProductRatingComments");
        Page<EventProductRatingComment> page = eventProductRatingCommentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-product-rating-comments/:id} : get the "id" eventProductRatingComment.
     *
     * @param id the id of the eventProductRatingComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventProductRatingComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-product-rating-comments/{id}")
    public ResponseEntity<EventProductRatingComment> getEventProductRatingComment(@PathVariable Long id) {
        log.debug("REST request to get EventProductRatingComment : {}", id);
        Optional<EventProductRatingComment> eventProductRatingComment = eventProductRatingCommentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventProductRatingComment);
    }

    /**
     * {@code DELETE  /event-product-rating-comments/:id} : delete the "id" eventProductRatingComment.
     *
     * @param id the id of the eventProductRatingComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-product-rating-comments/{id}")
    public ResponseEntity<Void> deleteEventProductRatingComment(@PathVariable Long id) {
        log.debug("REST request to delete EventProductRatingComment : {}", id);
        eventProductRatingCommentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
