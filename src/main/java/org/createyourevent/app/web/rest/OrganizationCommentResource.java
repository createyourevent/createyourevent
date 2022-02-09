package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationComment;
import org.createyourevent.app.repository.OrganizationCommentRepository;
import org.createyourevent.app.service.OrganizationCommentService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.OrganizationComment}.
 */
@RestController
@RequestMapping("/api")
public class OrganizationCommentResource {

    private final Logger log = LoggerFactory.getLogger(OrganizationCommentResource.class);

    private static final String ENTITY_NAME = "organizationComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizationCommentService organizationCommentService;

    private final OrganizationCommentRepository organizationCommentRepository;

    public OrganizationCommentResource(
        OrganizationCommentService organizationCommentService,
        OrganizationCommentRepository organizationCommentRepository
    ) {
        this.organizationCommentService = organizationCommentService;
        this.organizationCommentRepository = organizationCommentRepository;
    }

    /**
     * {@code POST  /organization-comments} : Create a new organizationComment.
     *
     * @param organizationComment the organizationComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organizationComment, or with status {@code 400 (Bad Request)} if the organizationComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/organization-comments")
    public ResponseEntity<OrganizationComment> createOrganizationComment(@RequestBody OrganizationComment organizationComment)
        throws URISyntaxException {
        log.debug("REST request to save OrganizationComment : {}", organizationComment);
        if (organizationComment.getId() != null) {
            throw new BadRequestAlertException("A new organizationComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrganizationComment result = organizationCommentService.save(organizationComment);
        return ResponseEntity
            .created(new URI("/api/organization-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /organization-comments/:id} : Updates an existing organizationComment.
     *
     * @param id the id of the organizationComment to save.
     * @param organizationComment the organizationComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organizationComment,
     * or with status {@code 400 (Bad Request)} if the organizationComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the organizationComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/organization-comments/{id}")
    public ResponseEntity<OrganizationComment> updateOrganizationComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrganizationComment organizationComment
    ) throws URISyntaxException {
        log.debug("REST request to update OrganizationComment : {}, {}", id, organizationComment);
        if (organizationComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organizationComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organizationCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrganizationComment result = organizationCommentService.save(organizationComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organizationComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /organization-comments/:id} : Partial updates given fields of an existing organizationComment, field will ignore if it is null
     *
     * @param id the id of the organizationComment to save.
     * @param organizationComment the organizationComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organizationComment,
     * or with status {@code 400 (Bad Request)} if the organizationComment is not valid,
     * or with status {@code 404 (Not Found)} if the organizationComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the organizationComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/organization-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrganizationComment> partialUpdateOrganizationComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrganizationComment organizationComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrganizationComment partially : {}, {}", id, organizationComment);
        if (organizationComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organizationComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organizationCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrganizationComment> result = organizationCommentService.partialUpdate(organizationComment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organizationComment.getId().toString())
        );
    }

    /**
     * {@code GET  /organization-comments} : get all the organizationComments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organizationComments in body.
     */
    @GetMapping("/organization-comments")
    public ResponseEntity<List<OrganizationComment>> getAllOrganizationComments(Pageable pageable) {
        log.debug("REST request to get a page of OrganizationComments");
        Page<OrganizationComment> page = organizationCommentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /organization-comments/:id} : get the "id" organizationComment.
     *
     * @param id the id of the organizationComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organizationComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organization-comments/{id}")
    public ResponseEntity<OrganizationComment> getOrganizationComment(@PathVariable Long id) {
        log.debug("REST request to get OrganizationComment : {}", id);
        Optional<OrganizationComment> organizationComment = organizationCommentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(organizationComment);
    }

    /**
     * {@code DELETE  /organization-comments/:id} : delete the "id" organizationComment.
     *
     * @param id the id of the organizationComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/organization-comments/{id}")
    public ResponseEntity<Void> deleteOrganizationComment(@PathVariable Long id) {
        log.debug("REST request to delete OrganizationComment : {}", id);
        organizationCommentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
