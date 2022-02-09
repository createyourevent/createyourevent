package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.createyourevent.app.domain.ServiceOffer;
import org.createyourevent.app.repository.ServiceOfferRepository;
import org.createyourevent.app.service.ServiceOfferService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ServiceOffer}.
 */
@RestController
@RequestMapping("/api")
public class ServiceOfferResource {

    private final Logger log = LoggerFactory.getLogger(ServiceOfferResource.class);

    private static final String ENTITY_NAME = "serviceOffer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceOfferService serviceOfferService;

    private final ServiceOfferRepository serviceOfferRepository;

    public ServiceOfferResource(ServiceOfferService serviceOfferService, ServiceOfferRepository serviceOfferRepository) {
        this.serviceOfferService = serviceOfferService;
        this.serviceOfferRepository = serviceOfferRepository;
    }

    /**
     * {@code POST  /service-offers} : Create a new serviceOffer.
     *
     * @param serviceOffer the serviceOffer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new serviceOffer, or with status {@code 400 (Bad Request)} if the serviceOffer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/service-offers")
    public ResponseEntity<ServiceOffer> createServiceOffer(@Valid @RequestBody ServiceOffer serviceOffer) throws URISyntaxException {
        log.debug("REST request to save ServiceOffer : {}", serviceOffer);
        if (serviceOffer.getId() != null) {
            throw new BadRequestAlertException("A new serviceOffer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceOffer result = serviceOfferService.save(serviceOffer);
        return ResponseEntity
            .created(new URI("/api/service-offers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /service-offers/:id} : Updates an existing serviceOffer.
     *
     * @param id the id of the serviceOffer to save.
     * @param serviceOffer the serviceOffer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceOffer,
     * or with status {@code 400 (Bad Request)} if the serviceOffer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the serviceOffer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/service-offers/{id}")
    public ResponseEntity<ServiceOffer> updateServiceOffer(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ServiceOffer serviceOffer
    ) throws URISyntaxException {
        log.debug("REST request to update ServiceOffer : {}, {}", id, serviceOffer);
        if (serviceOffer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceOffer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceOfferRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ServiceOffer result = serviceOfferService.save(serviceOffer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceOffer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /service-offers/:id} : Partial updates given fields of an existing serviceOffer, field will ignore if it is null
     *
     * @param id the id of the serviceOffer to save.
     * @param serviceOffer the serviceOffer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceOffer,
     * or with status {@code 400 (Bad Request)} if the serviceOffer is not valid,
     * or with status {@code 404 (Not Found)} if the serviceOffer is not found,
     * or with status {@code 500 (Internal Server Error)} if the serviceOffer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/service-offers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ServiceOffer> partialUpdateServiceOffer(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ServiceOffer serviceOffer
    ) throws URISyntaxException {
        log.debug("REST request to partial update ServiceOffer partially : {}, {}", id, serviceOffer);
        if (serviceOffer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceOffer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceOfferRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ServiceOffer> result = serviceOfferService.partialUpdate(serviceOffer);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceOffer.getId().toString())
        );
    }

    /**
     * {@code GET  /service-offers} : get all the serviceOffers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceOffers in body.
     */
    @GetMapping("/service-offers")
    public ResponseEntity<List<ServiceOffer>> getAllServiceOffers(Pageable pageable) {
        log.debug("REST request to get a page of ServiceOffers");
        Page<ServiceOffer> page = serviceOfferService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /service-offers/:id} : get the "id" serviceOffer.
     *
     * @param id the id of the serviceOffer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceOffer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/service-offers/{id}")
    public ResponseEntity<ServiceOffer> getServiceOffer(@PathVariable Long id) {
        log.debug("REST request to get ServiceOffer : {}", id);
        Optional<ServiceOffer> serviceOffer = serviceOfferService.findOne(id);
        return ResponseUtil.wrapOrNotFound(serviceOffer);
    }

    /**
     * {@code DELETE  /service-offers/:id} : delete the "id" serviceOffer.
     *
     * @param id the id of the serviceOffer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/service-offers/{id}")
    public ResponseEntity<Void> deleteServiceOffer(@PathVariable Long id) {
        log.debug("REST request to delete ServiceOffer : {}", id);
        serviceOfferService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
