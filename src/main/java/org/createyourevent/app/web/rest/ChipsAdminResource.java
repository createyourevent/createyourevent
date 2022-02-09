package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ChipsAdmin;
import org.createyourevent.app.repository.ChipsAdminRepository;
import org.createyourevent.app.service.ChipsAdminService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ChipsAdmin}.
 */
@RestController
@RequestMapping("/api")
public class ChipsAdminResource {

    private final Logger log = LoggerFactory.getLogger(ChipsAdminResource.class);

    private static final String ENTITY_NAME = "chipsAdmin";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChipsAdminService chipsAdminService;

    private final ChipsAdminRepository chipsAdminRepository;

    public ChipsAdminResource(ChipsAdminService chipsAdminService, ChipsAdminRepository chipsAdminRepository) {
        this.chipsAdminService = chipsAdminService;
        this.chipsAdminRepository = chipsAdminRepository;
    }

    /**
     * {@code POST  /chips-admins} : Create a new chipsAdmin.
     *
     * @param chipsAdmin the chipsAdmin to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chipsAdmin, or with status {@code 400 (Bad Request)} if the chipsAdmin has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chips-admins")
    public ResponseEntity<ChipsAdmin> createChipsAdmin(@RequestBody ChipsAdmin chipsAdmin) throws URISyntaxException {
        log.debug("REST request to save ChipsAdmin : {}", chipsAdmin);
        if (chipsAdmin.getId() != null) {
            throw new BadRequestAlertException("A new chipsAdmin cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChipsAdmin result = chipsAdminService.save(chipsAdmin);
        return ResponseEntity
            .created(new URI("/api/chips-admins/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chips-admins/:id} : Updates an existing chipsAdmin.
     *
     * @param id the id of the chipsAdmin to save.
     * @param chipsAdmin the chipsAdmin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chipsAdmin,
     * or with status {@code 400 (Bad Request)} if the chipsAdmin is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chipsAdmin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chips-admins/{id}")
    public ResponseEntity<ChipsAdmin> updateChipsAdmin(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChipsAdmin chipsAdmin
    ) throws URISyntaxException {
        log.debug("REST request to update ChipsAdmin : {}, {}", id, chipsAdmin);
        if (chipsAdmin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chipsAdmin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chipsAdminRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChipsAdmin result = chipsAdminService.save(chipsAdmin);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chipsAdmin.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chips-admins/:id} : Partial updates given fields of an existing chipsAdmin, field will ignore if it is null
     *
     * @param id the id of the chipsAdmin to save.
     * @param chipsAdmin the chipsAdmin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chipsAdmin,
     * or with status {@code 400 (Bad Request)} if the chipsAdmin is not valid,
     * or with status {@code 404 (Not Found)} if the chipsAdmin is not found,
     * or with status {@code 500 (Internal Server Error)} if the chipsAdmin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chips-admins/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChipsAdmin> partialUpdateChipsAdmin(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChipsAdmin chipsAdmin
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChipsAdmin partially : {}, {}", id, chipsAdmin);
        if (chipsAdmin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chipsAdmin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chipsAdminRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChipsAdmin> result = chipsAdminService.partialUpdate(chipsAdmin);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chipsAdmin.getId().toString())
        );
    }

    /**
     * {@code GET  /chips-admins} : get all the chipsAdmins.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chipsAdmins in body.
     */
    @GetMapping("/chips-admins")
    public ResponseEntity<List<ChipsAdmin>> getAllChipsAdmins(Pageable pageable) {
        log.debug("REST request to get a page of ChipsAdmins");
        Page<ChipsAdmin> page = chipsAdminService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chips-admins/:id} : get the "id" chipsAdmin.
     *
     * @param id the id of the chipsAdmin to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chipsAdmin, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chips-admins/{id}")
    public ResponseEntity<ChipsAdmin> getChipsAdmin(@PathVariable Long id) {
        log.debug("REST request to get ChipsAdmin : {}", id);
        Optional<ChipsAdmin> chipsAdmin = chipsAdminService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chipsAdmin);
    }

    /**
     * {@code DELETE  /chips-admins/:id} : delete the "id" chipsAdmin.
     *
     * @param id the id of the chipsAdmin to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chips-admins/{id}")
    public ResponseEntity<Void> deleteChipsAdmin(@PathVariable Long id) {
        log.debug("REST request to delete ChipsAdmin : {}", id);
        chipsAdminService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
