package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.DeliveryType;
import org.createyourevent.app.repository.DeliveryTypeRepository;
import org.createyourevent.app.service.DeliveryTypeService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.DeliveryType}.
 */
@RestController
@RequestMapping("/api")
public class DeliveryTypeResource {

    private final Logger log = LoggerFactory.getLogger(DeliveryTypeResource.class);

    private static final String ENTITY_NAME = "deliveryType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DeliveryTypeService deliveryTypeService;

    private final DeliveryTypeRepository deliveryTypeRepository;

    public DeliveryTypeResource(DeliveryTypeService deliveryTypeService, DeliveryTypeRepository deliveryTypeRepository) {
        this.deliveryTypeService = deliveryTypeService;
        this.deliveryTypeRepository = deliveryTypeRepository;
    }

    /**
     * {@code POST  /delivery-types} : Create a new deliveryType.
     *
     * @param deliveryType the deliveryType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new deliveryType, or with status {@code 400 (Bad Request)} if the deliveryType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/delivery-types")
    public ResponseEntity<DeliveryType> createDeliveryType(@RequestBody DeliveryType deliveryType) throws URISyntaxException {
        log.debug("REST request to save DeliveryType : {}", deliveryType);
        if (deliveryType.getId() != null) {
            throw new BadRequestAlertException("A new deliveryType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DeliveryType result = deliveryTypeService.save(deliveryType);
        return ResponseEntity
            .created(new URI("/api/delivery-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /delivery-types/:id} : Updates an existing deliveryType.
     *
     * @param id the id of the deliveryType to save.
     * @param deliveryType the deliveryType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deliveryType,
     * or with status {@code 400 (Bad Request)} if the deliveryType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the deliveryType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/delivery-types/{id}")
    public ResponseEntity<DeliveryType> updateDeliveryType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DeliveryType deliveryType
    ) throws URISyntaxException {
        log.debug("REST request to update DeliveryType : {}, {}", id, deliveryType);
        if (deliveryType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deliveryType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!deliveryTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DeliveryType result = deliveryTypeService.save(deliveryType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deliveryType.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /delivery-types/:id} : Partial updates given fields of an existing deliveryType, field will ignore if it is null
     *
     * @param id the id of the deliveryType to save.
     * @param deliveryType the deliveryType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deliveryType,
     * or with status {@code 400 (Bad Request)} if the deliveryType is not valid,
     * or with status {@code 404 (Not Found)} if the deliveryType is not found,
     * or with status {@code 500 (Internal Server Error)} if the deliveryType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/delivery-types/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DeliveryType> partialUpdateDeliveryType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DeliveryType deliveryType
    ) throws URISyntaxException {
        log.debug("REST request to partial update DeliveryType partially : {}, {}", id, deliveryType);
        if (deliveryType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deliveryType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!deliveryTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DeliveryType> result = deliveryTypeService.partialUpdate(deliveryType);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deliveryType.getId().toString())
        );
    }

    /**
     * {@code GET  /delivery-types} : get all the deliveryTypes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of deliveryTypes in body.
     */
    @GetMapping("/delivery-types")
    public ResponseEntity<List<DeliveryType>> getAllDeliveryTypes(Pageable pageable) {
        log.debug("REST request to get a page of DeliveryTypes");
        Page<DeliveryType> page = deliveryTypeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /delivery-types/:id} : get the "id" deliveryType.
     *
     * @param id the id of the deliveryType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the deliveryType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/delivery-types/{id}")
    public ResponseEntity<DeliveryType> getDeliveryType(@PathVariable Long id) {
        log.debug("REST request to get DeliveryType : {}", id);
        Optional<DeliveryType> deliveryType = deliveryTypeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(deliveryType);
    }

    /**
     * {@code DELETE  /delivery-types/:id} : delete the "id" deliveryType.
     *
     * @param id the id of the deliveryType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/delivery-types/{id}")
    public ResponseEntity<Void> deleteDeliveryType(@PathVariable Long id) {
        log.debug("REST request to delete DeliveryType : {}", id);
        deliveryTypeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
