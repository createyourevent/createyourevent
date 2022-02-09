package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.createyourevent.app.domain.ServiceMap;
import org.createyourevent.app.repository.ServiceMapRepository;
import org.createyourevent.app.service.ServiceMapService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ServiceMap}.
 */
@RestController
@RequestMapping("/api")
public class ServiceMapResource {

    private final Logger log = LoggerFactory.getLogger(ServiceMapResource.class);

    private static final String ENTITY_NAME = "serviceMap";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceMapService serviceMapService;

    private final ServiceMapRepository serviceMapRepository;

    public ServiceMapResource(ServiceMapService serviceMapService, ServiceMapRepository serviceMapRepository) {
        this.serviceMapService = serviceMapService;
        this.serviceMapRepository = serviceMapRepository;
    }

    /**
     * {@code POST  /service-maps} : Create a new serviceMap.
     *
     * @param serviceMap the serviceMap to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new serviceMap, or with status {@code 400 (Bad Request)} if the serviceMap has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/service-maps")
    public ResponseEntity<ServiceMap> createServiceMap(@Valid @RequestBody ServiceMap serviceMap) throws URISyntaxException {
        log.debug("REST request to save ServiceMap : {}", serviceMap);
        if (serviceMap.getId() != null) {
            throw new BadRequestAlertException("A new serviceMap cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceMap result = serviceMapService.save(serviceMap);
        return ResponseEntity
            .created(new URI("/api/service-maps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /service-maps/:id} : Updates an existing serviceMap.
     *
     * @param id the id of the serviceMap to save.
     * @param serviceMap the serviceMap to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceMap,
     * or with status {@code 400 (Bad Request)} if the serviceMap is not valid,
     * or with status {@code 500 (Internal Server Error)} if the serviceMap couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/service-maps/{id}")
    public ResponseEntity<ServiceMap> updateServiceMap(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ServiceMap serviceMap
    ) throws URISyntaxException {
        log.debug("REST request to update ServiceMap : {}, {}", id, serviceMap);
        if (serviceMap.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceMap.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceMapRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ServiceMap result = serviceMapService.save(serviceMap);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceMap.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /service-maps/:id} : Partial updates given fields of an existing serviceMap, field will ignore if it is null
     *
     * @param id the id of the serviceMap to save.
     * @param serviceMap the serviceMap to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceMap,
     * or with status {@code 400 (Bad Request)} if the serviceMap is not valid,
     * or with status {@code 404 (Not Found)} if the serviceMap is not found,
     * or with status {@code 500 (Internal Server Error)} if the serviceMap couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/service-maps/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ServiceMap> partialUpdateServiceMap(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ServiceMap serviceMap
    ) throws URISyntaxException {
        log.debug("REST request to partial update ServiceMap partially : {}, {}", id, serviceMap);
        if (serviceMap.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceMap.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceMapRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ServiceMap> result = serviceMapService.partialUpdate(serviceMap);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceMap.getId().toString())
        );
    }

    /**
     * {@code GET  /service-maps} : get all the serviceMaps.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceMaps in body.
     */
    @GetMapping("/service-maps")
    public ResponseEntity<List<ServiceMap>> getAllServiceMaps(Pageable pageable) {
        log.debug("REST request to get a page of ServiceMaps");
        Page<ServiceMap> page = serviceMapService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /service-maps/:id} : get the "id" serviceMap.
     *
     * @param id the id of the serviceMap to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceMap, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/service-maps/{id}")
    public ResponseEntity<ServiceMap> getServiceMap(@PathVariable Long id) {
        log.debug("REST request to get ServiceMap : {}", id);
        Optional<ServiceMap> serviceMap = serviceMapService.findOne(id);
        return ResponseUtil.wrapOrNotFound(serviceMap);
    }

    /**
     * {@code DELETE  /service-maps/:id} : delete the "id" serviceMap.
     *
     * @param id the id of the serviceMap to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/service-maps/{id}")
    public ResponseEntity<Void> deleteServiceMap(@PathVariable Long id) {
        log.debug("REST request to delete ServiceMap : {}", id);
        serviceMapService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
