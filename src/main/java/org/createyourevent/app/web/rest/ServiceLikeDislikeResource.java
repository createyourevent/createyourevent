package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ServiceLikeDislike;
import org.createyourevent.app.repository.ServiceLikeDislikeRepository;
import org.createyourevent.app.service.ServiceLikeDislikeService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ServiceLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class ServiceLikeDislikeResource {

    private final Logger log = LoggerFactory.getLogger(ServiceLikeDislikeResource.class);

    private static final String ENTITY_NAME = "serviceLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceLikeDislikeService serviceLikeDislikeService;

    private final ServiceLikeDislikeRepository serviceLikeDislikeRepository;

    public ServiceLikeDislikeResource(
        ServiceLikeDislikeService serviceLikeDislikeService,
        ServiceLikeDislikeRepository serviceLikeDislikeRepository
    ) {
        this.serviceLikeDislikeService = serviceLikeDislikeService;
        this.serviceLikeDislikeRepository = serviceLikeDislikeRepository;
    }

    /**
     * {@code POST  /service-like-dislikes} : Create a new serviceLikeDislike.
     *
     * @param serviceLikeDislike the serviceLikeDislike to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new serviceLikeDislike, or with status {@code 400 (Bad Request)} if the serviceLikeDislike has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/service-like-dislikes")
    public ResponseEntity<ServiceLikeDislike> createServiceLikeDislike(@RequestBody ServiceLikeDislike serviceLikeDislike)
        throws URISyntaxException {
        log.debug("REST request to save ServiceLikeDislike : {}", serviceLikeDislike);
        if (serviceLikeDislike.getId() != null) {
            throw new BadRequestAlertException("A new serviceLikeDislike cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceLikeDislike result = serviceLikeDislikeService.save(serviceLikeDislike);
        return ResponseEntity
            .created(new URI("/api/service-like-dislikes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /service-like-dislikes/:id} : Updates an existing serviceLikeDislike.
     *
     * @param id the id of the serviceLikeDislike to save.
     * @param serviceLikeDislike the serviceLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceLikeDislike,
     * or with status {@code 400 (Bad Request)} if the serviceLikeDislike is not valid,
     * or with status {@code 500 (Internal Server Error)} if the serviceLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/service-like-dislikes/{id}")
    public ResponseEntity<ServiceLikeDislike> updateServiceLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceLikeDislike serviceLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to update ServiceLikeDislike : {}, {}", id, serviceLikeDislike);
        if (serviceLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ServiceLikeDislike result = serviceLikeDislikeService.save(serviceLikeDislike);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceLikeDislike.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /service-like-dislikes/:id} : Partial updates given fields of an existing serviceLikeDislike, field will ignore if it is null
     *
     * @param id the id of the serviceLikeDislike to save.
     * @param serviceLikeDislike the serviceLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceLikeDislike,
     * or with status {@code 400 (Bad Request)} if the serviceLikeDislike is not valid,
     * or with status {@code 404 (Not Found)} if the serviceLikeDislike is not found,
     * or with status {@code 500 (Internal Server Error)} if the serviceLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/service-like-dislikes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ServiceLikeDislike> partialUpdateServiceLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceLikeDislike serviceLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to partial update ServiceLikeDislike partially : {}, {}", id, serviceLikeDislike);
        if (serviceLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ServiceLikeDislike> result = serviceLikeDislikeService.partialUpdate(serviceLikeDislike);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceLikeDislike.getId().toString())
        );
    }

    /**
     * {@code GET  /service-like-dislikes} : get all the serviceLikeDislikes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceLikeDislikes in body.
     */
    @GetMapping("/service-like-dislikes")
    public ResponseEntity<List<ServiceLikeDislike>> getAllServiceLikeDislikes(Pageable pageable) {
        log.debug("REST request to get a page of ServiceLikeDislikes");
        Page<ServiceLikeDislike> page = serviceLikeDislikeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /service-like-dislikes/:id} : get the "id" serviceLikeDislike.
     *
     * @param id the id of the serviceLikeDislike to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceLikeDislike, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/service-like-dislikes/{id}")
    public ResponseEntity<ServiceLikeDislike> getServiceLikeDislike(@PathVariable Long id) {
        log.debug("REST request to get ServiceLikeDislike : {}", id);
        Optional<ServiceLikeDislike> serviceLikeDislike = serviceLikeDislikeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(serviceLikeDislike);
    }

    /**
     * {@code DELETE  /service-like-dislikes/:id} : delete the "id" serviceLikeDislike.
     *
     * @param id the id of the serviceLikeDislike to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/service-like-dislikes/{id}")
    public ResponseEntity<Void> deleteServiceLikeDislike(@PathVariable Long id) {
        log.debug("REST request to delete ServiceLikeDislike : {}", id);
        serviceLikeDislikeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
