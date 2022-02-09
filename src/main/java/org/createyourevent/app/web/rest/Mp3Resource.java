package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Mp3;
import org.createyourevent.app.repository.Mp3Repository;
import org.createyourevent.app.service.Mp3Service;
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
 * REST controller for managing {@link org.createyourevent.app.domain.Mp3}.
 */
@RestController
@RequestMapping("/api")
public class Mp3Resource {

    private final Logger log = LoggerFactory.getLogger(Mp3Resource.class);

    private static final String ENTITY_NAME = "mp3";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Mp3Service mp3Service;

    private final Mp3Repository mp3Repository;

    public Mp3Resource(Mp3Service mp3Service, Mp3Repository mp3Repository) {
        this.mp3Service = mp3Service;
        this.mp3Repository = mp3Repository;
    }

    /**
     * {@code POST  /mp-3-s} : Create a new mp3.
     *
     * @param mp3 the mp3 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mp3, or with status {@code 400 (Bad Request)} if the mp3 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mp-3-s")
    public ResponseEntity<Mp3> createMp3(@RequestBody Mp3 mp3) throws URISyntaxException {
        log.debug("REST request to save Mp3 : {}", mp3);
        if (mp3.getId() != null) {
            throw new BadRequestAlertException("A new mp3 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mp3 result = mp3Service.save(mp3);
        return ResponseEntity
            .created(new URI("/api/mp-3-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mp-3-s/:id} : Updates an existing mp3.
     *
     * @param id the id of the mp3 to save.
     * @param mp3 the mp3 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mp3,
     * or with status {@code 400 (Bad Request)} if the mp3 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mp3 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mp-3-s/{id}")
    public ResponseEntity<Mp3> updateMp3(@PathVariable(value = "id", required = false) final Long id, @RequestBody Mp3 mp3)
        throws URISyntaxException {
        log.debug("REST request to update Mp3 : {}, {}", id, mp3);
        if (mp3.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mp3.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mp3Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mp3 result = mp3Service.save(mp3);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mp3.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mp-3-s/:id} : Partial updates given fields of an existing mp3, field will ignore if it is null
     *
     * @param id the id of the mp3 to save.
     * @param mp3 the mp3 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mp3,
     * or with status {@code 400 (Bad Request)} if the mp3 is not valid,
     * or with status {@code 404 (Not Found)} if the mp3 is not found,
     * or with status {@code 500 (Internal Server Error)} if the mp3 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mp-3-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mp3> partialUpdateMp3(@PathVariable(value = "id", required = false) final Long id, @RequestBody Mp3 mp3)
        throws URISyntaxException {
        log.debug("REST request to partial update Mp3 partially : {}, {}", id, mp3);
        if (mp3.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mp3.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mp3Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mp3> result = mp3Service.partialUpdate(mp3);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mp3.getId().toString())
        );
    }

    /**
     * {@code GET  /mp-3-s} : get all the mp3s.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mp3s in body.
     */
    @GetMapping("/mp-3-s")
    public ResponseEntity<List<Mp3>> getAllMp3s(Pageable pageable) {
        log.debug("REST request to get a page of Mp3s");
        Page<Mp3> page = mp3Service.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /mp-3-s/:id} : get the "id" mp3.
     *
     * @param id the id of the mp3 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mp3, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mp-3-s/{id}")
    public ResponseEntity<Mp3> getMp3(@PathVariable Long id) {
        log.debug("REST request to get Mp3 : {}", id);
        Optional<Mp3> mp3 = mp3Service.findOne(id);
        return ResponseUtil.wrapOrNotFound(mp3);
    }

    /**
     * {@code DELETE  /mp-3-s/:id} : delete the "id" mp3.
     *
     * @param id the id of the mp3 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mp-3-s/{id}")
    public ResponseEntity<Void> deleteMp3(@PathVariable Long id) {
        log.debug("REST request to delete Mp3 : {}", id);
        mp3Service.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
