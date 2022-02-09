package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.PointsExchange;
import org.createyourevent.app.repository.PointsExchangeRepository;
import org.createyourevent.app.service.PointsExchangeService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.PointsExchange}.
 */
@RestController
@RequestMapping("/api")
public class PointsExchangeResource {

    private final Logger log = LoggerFactory.getLogger(PointsExchangeResource.class);

    private static final String ENTITY_NAME = "pointsExchange";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PointsExchangeService pointsExchangeService;

    private final PointsExchangeRepository pointsExchangeRepository;

    public PointsExchangeResource(PointsExchangeService pointsExchangeService, PointsExchangeRepository pointsExchangeRepository) {
        this.pointsExchangeService = pointsExchangeService;
        this.pointsExchangeRepository = pointsExchangeRepository;
    }

    /**
     * {@code POST  /points-exchanges} : Create a new pointsExchange.
     *
     * @param pointsExchange the pointsExchange to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pointsExchange, or with status {@code 400 (Bad Request)} if the pointsExchange has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/points-exchanges")
    public ResponseEntity<PointsExchange> createPointsExchange(@RequestBody PointsExchange pointsExchange) throws URISyntaxException {
        log.debug("REST request to save PointsExchange : {}", pointsExchange);
        if (pointsExchange.getId() != null) {
            throw new BadRequestAlertException("A new pointsExchange cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PointsExchange result = pointsExchangeService.save(pointsExchange);
        return ResponseEntity
            .created(new URI("/api/points-exchanges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /points-exchanges/:id} : Updates an existing pointsExchange.
     *
     * @param id the id of the pointsExchange to save.
     * @param pointsExchange the pointsExchange to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pointsExchange,
     * or with status {@code 400 (Bad Request)} if the pointsExchange is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pointsExchange couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/points-exchanges/{id}")
    public ResponseEntity<PointsExchange> updatePointsExchange(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PointsExchange pointsExchange
    ) throws URISyntaxException {
        log.debug("REST request to update PointsExchange : {}, {}", id, pointsExchange);
        if (pointsExchange.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pointsExchange.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pointsExchangeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PointsExchange result = pointsExchangeService.save(pointsExchange);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pointsExchange.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /points-exchanges/:id} : Partial updates given fields of an existing pointsExchange, field will ignore if it is null
     *
     * @param id the id of the pointsExchange to save.
     * @param pointsExchange the pointsExchange to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pointsExchange,
     * or with status {@code 400 (Bad Request)} if the pointsExchange is not valid,
     * or with status {@code 404 (Not Found)} if the pointsExchange is not found,
     * or with status {@code 500 (Internal Server Error)} if the pointsExchange couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/points-exchanges/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PointsExchange> partialUpdatePointsExchange(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PointsExchange pointsExchange
    ) throws URISyntaxException {
        log.debug("REST request to partial update PointsExchange partially : {}, {}", id, pointsExchange);
        if (pointsExchange.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pointsExchange.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pointsExchangeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PointsExchange> result = pointsExchangeService.partialUpdate(pointsExchange);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pointsExchange.getId().toString())
        );
    }

    /**
     * {@code GET  /points-exchanges} : get all the pointsExchanges.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pointsExchanges in body.
     */
    @GetMapping("/points-exchanges")
    public ResponseEntity<List<PointsExchange>> getAllPointsExchanges(Pageable pageable) {
        log.debug("REST request to get a page of PointsExchanges");
        Page<PointsExchange> page = pointsExchangeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /points-exchanges/:id} : get the "id" pointsExchange.
     *
     * @param id the id of the pointsExchange to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pointsExchange, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/points-exchanges/{id}")
    public ResponseEntity<PointsExchange> getPointsExchange(@PathVariable Long id) {
        log.debug("REST request to get PointsExchange : {}", id);
        Optional<PointsExchange> pointsExchange = pointsExchangeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(pointsExchange);
    }

    /**
     * {@code DELETE  /points-exchanges/:id} : delete the "id" pointsExchange.
     *
     * @param id the id of the pointsExchange to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/points-exchanges/{id}")
    public ResponseEntity<Void> deletePointsExchange(@PathVariable Long id) {
        log.debug("REST request to delete PointsExchange : {}", id);
        pointsExchangeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
