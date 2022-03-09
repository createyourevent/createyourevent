package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.SlotListPlum;
import org.createyourevent.app.repository.SlotListPlumRepository;
import org.createyourevent.app.service.SlotListPlumService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.SlotListPlum}.
 */
@RestController
@RequestMapping("/api")
public class SlotListPlumResource {

    private final Logger log = LoggerFactory.getLogger(SlotListPlumResource.class);

    private static final String ENTITY_NAME = "slotListPlum";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SlotListPlumService slotListPlumService;

    private final SlotListPlumRepository slotListPlumRepository;

    public SlotListPlumResource(SlotListPlumService slotListPlumService, SlotListPlumRepository slotListPlumRepository) {
        this.slotListPlumService = slotListPlumService;
        this.slotListPlumRepository = slotListPlumRepository;
    }

    /**
     * {@code POST  /slot-list-plums} : Create a new slotListPlum.
     *
     * @param slotListPlum the slotListPlum to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new slotListPlum, or with status {@code 400 (Bad Request)} if the slotListPlum has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/slot-list-plums")
    public ResponseEntity<SlotListPlum> createSlotListPlum(@RequestBody SlotListPlum slotListPlum) throws URISyntaxException {
        log.debug("REST request to save SlotListPlum : {}", slotListPlum);
        if (slotListPlum.getId() != null) {
            throw new BadRequestAlertException("A new slotListPlum cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SlotListPlum result = slotListPlumService.save(slotListPlum);
        return ResponseEntity
            .created(new URI("/api/slot-list-plums/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /slot-list-plums/:id} : Updates an existing slotListPlum.
     *
     * @param id the id of the slotListPlum to save.
     * @param slotListPlum the slotListPlum to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated slotListPlum,
     * or with status {@code 400 (Bad Request)} if the slotListPlum is not valid,
     * or with status {@code 500 (Internal Server Error)} if the slotListPlum couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/slot-list-plums/{id}")
    public ResponseEntity<SlotListPlum> updateSlotListPlum(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SlotListPlum slotListPlum
    ) throws URISyntaxException {
        log.debug("REST request to update SlotListPlum : {}, {}", id, slotListPlum);
        if (slotListPlum.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, slotListPlum.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!slotListPlumRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SlotListPlum result = slotListPlumService.save(slotListPlum);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, slotListPlum.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /slot-list-plums/:id} : Partial updates given fields of an existing slotListPlum, field will ignore if it is null
     *
     * @param id the id of the slotListPlum to save.
     * @param slotListPlum the slotListPlum to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated slotListPlum,
     * or with status {@code 400 (Bad Request)} if the slotListPlum is not valid,
     * or with status {@code 404 (Not Found)} if the slotListPlum is not found,
     * or with status {@code 500 (Internal Server Error)} if the slotListPlum couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/slot-list-plums/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SlotListPlum> partialUpdateSlotListPlum(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SlotListPlum slotListPlum
    ) throws URISyntaxException {
        log.debug("REST request to partial update SlotListPlum partially : {}, {}", id, slotListPlum);
        if (slotListPlum.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, slotListPlum.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!slotListPlumRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SlotListPlum> result = slotListPlumService.partialUpdate(slotListPlum);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, slotListPlum.getId().toString())
        );
    }

    /**
     * {@code GET  /slot-list-plums} : get all the slotListPlums.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of slotListPlums in body.
     */
    @GetMapping("/slot-list-plums")
    public ResponseEntity<List<SlotListPlum>> getAllSlotListPlums(Pageable pageable) {
        log.debug("REST request to get a page of SlotListPlums");
        Page<SlotListPlum> page = slotListPlumService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /slot-list-plums/:id} : get the "id" slotListPlum.
     *
     * @param id the id of the slotListPlum to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the slotListPlum, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/slot-list-plums/{id}")
    public ResponseEntity<SlotListPlum> getSlotListPlum(@PathVariable Long id) {
        log.debug("REST request to get SlotListPlum : {}", id);
        Optional<SlotListPlum> slotListPlum = slotListPlumService.findOne(id);
        return ResponseUtil.wrapOrNotFound(slotListPlum);
    }

    /**
     * {@code DELETE  /slot-list-plums/:id} : delete the "id" slotListPlum.
     *
     * @param id the id of the slotListPlum to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/slot-list-plums/{id}")
    public ResponseEntity<Void> deleteSlotListPlum(@PathVariable Long id) {
        log.debug("REST request to delete SlotListPlum : {}", id);
        slotListPlumService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
