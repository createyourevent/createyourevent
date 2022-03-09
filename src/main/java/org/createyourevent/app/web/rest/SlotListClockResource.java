package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.SlotListClock;
import org.createyourevent.app.repository.SlotListClockRepository;
import org.createyourevent.app.service.SlotListClockService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.SlotListClock}.
 */
@RestController
@RequestMapping("/api")
public class SlotListClockResource {

    private final Logger log = LoggerFactory.getLogger(SlotListClockResource.class);

    private static final String ENTITY_NAME = "slotListClock";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SlotListClockService slotListClockService;

    private final SlotListClockRepository slotListClockRepository;

    public SlotListClockResource(SlotListClockService slotListClockService, SlotListClockRepository slotListClockRepository) {
        this.slotListClockService = slotListClockService;
        this.slotListClockRepository = slotListClockRepository;
    }

    /**
     * {@code POST  /slot-list-clocks} : Create a new slotListClock.
     *
     * @param slotListClock the slotListClock to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new slotListClock, or with status {@code 400 (Bad Request)} if the slotListClock has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/slot-list-clocks")
    public ResponseEntity<SlotListClock> createSlotListClock(@RequestBody SlotListClock slotListClock) throws URISyntaxException {
        log.debug("REST request to save SlotListClock : {}", slotListClock);
        if (slotListClock.getId() != null) {
            throw new BadRequestAlertException("A new slotListClock cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SlotListClock result = slotListClockService.save(slotListClock);
        return ResponseEntity
            .created(new URI("/api/slot-list-clocks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /slot-list-clocks/:id} : Updates an existing slotListClock.
     *
     * @param id the id of the slotListClock to save.
     * @param slotListClock the slotListClock to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated slotListClock,
     * or with status {@code 400 (Bad Request)} if the slotListClock is not valid,
     * or with status {@code 500 (Internal Server Error)} if the slotListClock couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/slot-list-clocks/{id}")
    public ResponseEntity<SlotListClock> updateSlotListClock(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SlotListClock slotListClock
    ) throws URISyntaxException {
        log.debug("REST request to update SlotListClock : {}, {}", id, slotListClock);
        if (slotListClock.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, slotListClock.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!slotListClockRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SlotListClock result = slotListClockService.save(slotListClock);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, slotListClock.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /slot-list-clocks/:id} : Partial updates given fields of an existing slotListClock, field will ignore if it is null
     *
     * @param id the id of the slotListClock to save.
     * @param slotListClock the slotListClock to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated slotListClock,
     * or with status {@code 400 (Bad Request)} if the slotListClock is not valid,
     * or with status {@code 404 (Not Found)} if the slotListClock is not found,
     * or with status {@code 500 (Internal Server Error)} if the slotListClock couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/slot-list-clocks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SlotListClock> partialUpdateSlotListClock(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SlotListClock slotListClock
    ) throws URISyntaxException {
        log.debug("REST request to partial update SlotListClock partially : {}, {}", id, slotListClock);
        if (slotListClock.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, slotListClock.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!slotListClockRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SlotListClock> result = slotListClockService.partialUpdate(slotListClock);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, slotListClock.getId().toString())
        );
    }

    /**
     * {@code GET  /slot-list-clocks} : get all the slotListClocks.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of slotListClocks in body.
     */
    @GetMapping("/slot-list-clocks")
    public ResponseEntity<List<SlotListClock>> getAllSlotListClocks(Pageable pageable) {
        log.debug("REST request to get a page of SlotListClocks");
        Page<SlotListClock> page = slotListClockService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /slot-list-clocks/:id} : get the "id" slotListClock.
     *
     * @param id the id of the slotListClock to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the slotListClock, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/slot-list-clocks/{id}")
    public ResponseEntity<SlotListClock> getSlotListClock(@PathVariable Long id) {
        log.debug("REST request to get SlotListClock : {}", id);
        Optional<SlotListClock> slotListClock = slotListClockService.findOne(id);
        return ResponseUtil.wrapOrNotFound(slotListClock);
    }

    /**
     * {@code DELETE  /slot-list-clocks/:id} : delete the "id" slotListClock.
     *
     * @param id the id of the slotListClock to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/slot-list-clocks/{id}")
    public ResponseEntity<Void> deleteSlotListClock(@PathVariable Long id) {
        log.debug("REST request to delete SlotListClock : {}", id);
        slotListClockService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
