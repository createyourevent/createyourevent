package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ServiceComment;
import org.createyourevent.app.repository.ServiceCommentRepository;
import org.createyourevent.app.service.ServiceCommentService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ServiceComment}.
 */
@RestController
@RequestMapping("/api")
public class ServiceCommentResource {

    private final Logger log = LoggerFactory.getLogger(ServiceCommentResource.class);

    private static final String ENTITY_NAME = "serviceComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceCommentService serviceCommentService;

    private final ServiceCommentRepository serviceCommentRepository;

    public ServiceCommentResource(ServiceCommentService serviceCommentService, ServiceCommentRepository serviceCommentRepository) {
        this.serviceCommentService = serviceCommentService;
        this.serviceCommentRepository = serviceCommentRepository;
    }

    /**
     * {@code POST  /service-comments} : Create a new serviceComment.
     *
     * @param serviceComment the serviceComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new serviceComment, or with status {@code 400 (Bad Request)} if the serviceComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/service-comments")
    public ResponseEntity<ServiceComment> createServiceComment(@RequestBody ServiceComment serviceComment) throws URISyntaxException {
        log.debug("REST request to save ServiceComment : {}", serviceComment);
        if (serviceComment.getId() != null) {
            throw new BadRequestAlertException("A new serviceComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceComment result = serviceCommentService.save(serviceComment);
        return ResponseEntity
            .created(new URI("/api/service-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /service-comments/:id} : Updates an existing serviceComment.
     *
     * @param id the id of the serviceComment to save.
     * @param serviceComment the serviceComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceComment,
     * or with status {@code 400 (Bad Request)} if the serviceComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the serviceComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/service-comments/{id}")
    public ResponseEntity<ServiceComment> updateServiceComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceComment serviceComment
    ) throws URISyntaxException {
        log.debug("REST request to update ServiceComment : {}, {}", id, serviceComment);
        if (serviceComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ServiceComment result = serviceCommentService.save(serviceComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /service-comments/:id} : Partial updates given fields of an existing serviceComment, field will ignore if it is null
     *
     * @param id the id of the serviceComment to save.
     * @param serviceComment the serviceComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceComment,
     * or with status {@code 400 (Bad Request)} if the serviceComment is not valid,
     * or with status {@code 404 (Not Found)} if the serviceComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the serviceComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/service-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ServiceComment> partialUpdateServiceComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceComment serviceComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update ServiceComment partially : {}, {}", id, serviceComment);
        if (serviceComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ServiceComment> result = serviceCommentService.partialUpdate(serviceComment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceComment.getId().toString())
        );
    }

    /**
     * {@code GET  /service-comments} : get all the serviceComments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceComments in body.
     */
    @GetMapping("/service-comments")
    public ResponseEntity<List<ServiceComment>> getAllServiceComments(Pageable pageable) {
        log.debug("REST request to get a page of ServiceComments");
        Page<ServiceComment> page = serviceCommentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /service-comments/:id} : get the "id" serviceComment.
     *
     * @param id the id of the serviceComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/service-comments/{id}")
    public ResponseEntity<ServiceComment> getServiceComment(@PathVariable Long id) {
        log.debug("REST request to get ServiceComment : {}", id);
        Optional<ServiceComment> serviceComment = serviceCommentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(serviceComment);
    }

    /**
     * {@code DELETE  /service-comments/:id} : delete the "id" serviceComment.
     *
     * @param id the id of the serviceComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/service-comments/{id}")
    public ResponseEntity<Void> deleteServiceComment(@PathVariable Long id) {
        log.debug("REST request to delete ServiceComment : {}", id);
        serviceCommentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
