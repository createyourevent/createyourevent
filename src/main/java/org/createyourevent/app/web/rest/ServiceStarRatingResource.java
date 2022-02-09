package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ServiceStarRating;
import org.createyourevent.app.repository.ServiceStarRatingRepository;
import org.createyourevent.app.service.ServiceStarRatingService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ServiceStarRating}.
 */
@RestController
@RequestMapping("/api")
public class ServiceStarRatingResource {

    private final Logger log = LoggerFactory.getLogger(ServiceStarRatingResource.class);

    private static final String ENTITY_NAME = "serviceStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceStarRatingService serviceStarRatingService;

    private final ServiceStarRatingRepository serviceStarRatingRepository;

    public ServiceStarRatingResource(
        ServiceStarRatingService serviceStarRatingService,
        ServiceStarRatingRepository serviceStarRatingRepository
    ) {
        this.serviceStarRatingService = serviceStarRatingService;
        this.serviceStarRatingRepository = serviceStarRatingRepository;
    }

    /**
     * {@code POST  /service-star-ratings} : Create a new serviceStarRating.
     *
     * @param serviceStarRating the serviceStarRating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new serviceStarRating, or with status {@code 400 (Bad Request)} if the serviceStarRating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/service-star-ratings")
    public ResponseEntity<ServiceStarRating> createServiceStarRating(@RequestBody ServiceStarRating serviceStarRating)
        throws URISyntaxException {
        log.debug("REST request to save ServiceStarRating : {}", serviceStarRating);
        if (serviceStarRating.getId() != null) {
            throw new BadRequestAlertException("A new serviceStarRating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceStarRating result = serviceStarRatingService.save(serviceStarRating);
        return ResponseEntity
            .created(new URI("/api/service-star-ratings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /service-star-ratings/:id} : Updates an existing serviceStarRating.
     *
     * @param id the id of the serviceStarRating to save.
     * @param serviceStarRating the serviceStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceStarRating,
     * or with status {@code 400 (Bad Request)} if the serviceStarRating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the serviceStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/service-star-ratings/{id}")
    public ResponseEntity<ServiceStarRating> updateServiceStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceStarRating serviceStarRating
    ) throws URISyntaxException {
        log.debug("REST request to update ServiceStarRating : {}, {}", id, serviceStarRating);
        if (serviceStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ServiceStarRating result = serviceStarRatingService.save(serviceStarRating);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceStarRating.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /service-star-ratings/:id} : Partial updates given fields of an existing serviceStarRating, field will ignore if it is null
     *
     * @param id the id of the serviceStarRating to save.
     * @param serviceStarRating the serviceStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceStarRating,
     * or with status {@code 400 (Bad Request)} if the serviceStarRating is not valid,
     * or with status {@code 404 (Not Found)} if the serviceStarRating is not found,
     * or with status {@code 500 (Internal Server Error)} if the serviceStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/service-star-ratings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ServiceStarRating> partialUpdateServiceStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceStarRating serviceStarRating
    ) throws URISyntaxException {
        log.debug("REST request to partial update ServiceStarRating partially : {}, {}", id, serviceStarRating);
        if (serviceStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ServiceStarRating> result = serviceStarRatingService.partialUpdate(serviceStarRating);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceStarRating.getId().toString())
        );
    }

    /**
     * {@code GET  /service-star-ratings} : get all the serviceStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceStarRatings in body.
     */
    @GetMapping("/service-star-ratings")
    public ResponseEntity<List<ServiceStarRating>> getAllServiceStarRatings(Pageable pageable) {
        log.debug("REST request to get a page of ServiceStarRatings");
        Page<ServiceStarRating> page = serviceStarRatingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /service-star-ratings/:id} : get the "id" serviceStarRating.
     *
     * @param id the id of the serviceStarRating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceStarRating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/service-star-ratings/{id}")
    public ResponseEntity<ServiceStarRating> getServiceStarRating(@PathVariable Long id) {
        log.debug("REST request to get ServiceStarRating : {}", id);
        Optional<ServiceStarRating> serviceStarRating = serviceStarRatingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(serviceStarRating);
    }

    /**
     * {@code DELETE  /service-star-ratings/:id} : delete the "id" serviceStarRating.
     *
     * @param id the id of the serviceStarRating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/service-star-ratings/{id}")
    public ResponseEntity<Void> deleteServiceStarRating(@PathVariable Long id) {
        log.debug("REST request to delete ServiceStarRating : {}", id);
        serviceStarRatingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
