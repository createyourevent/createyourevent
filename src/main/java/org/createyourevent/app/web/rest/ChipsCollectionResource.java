package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ChipsCollection;
import org.createyourevent.app.repository.ChipsCollectionRepository;
import org.createyourevent.app.service.ChipsCollectionService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ChipsCollection}.
 */
@RestController
@RequestMapping("/api")
public class ChipsCollectionResource {

    private final Logger log = LoggerFactory.getLogger(ChipsCollectionResource.class);

    private static final String ENTITY_NAME = "chipsCollection";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChipsCollectionService chipsCollectionService;

    private final ChipsCollectionRepository chipsCollectionRepository;

    public ChipsCollectionResource(ChipsCollectionService chipsCollectionService, ChipsCollectionRepository chipsCollectionRepository) {
        this.chipsCollectionService = chipsCollectionService;
        this.chipsCollectionRepository = chipsCollectionRepository;
    }

    /**
     * {@code POST  /chips-collections} : Create a new chipsCollection.
     *
     * @param chipsCollection the chipsCollection to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chipsCollection, or with status {@code 400 (Bad Request)} if the chipsCollection has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chips-collections")
    public ResponseEntity<ChipsCollection> createChipsCollection(@RequestBody ChipsCollection chipsCollection) throws URISyntaxException {
        log.debug("REST request to save ChipsCollection : {}", chipsCollection);
        if (chipsCollection.getId() != null) {
            throw new BadRequestAlertException("A new chipsCollection cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChipsCollection result = chipsCollectionService.save(chipsCollection);
        return ResponseEntity
            .created(new URI("/api/chips-collections/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chips-collections/:id} : Updates an existing chipsCollection.
     *
     * @param id the id of the chipsCollection to save.
     * @param chipsCollection the chipsCollection to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chipsCollection,
     * or with status {@code 400 (Bad Request)} if the chipsCollection is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chipsCollection couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chips-collections/{id}")
    public ResponseEntity<ChipsCollection> updateChipsCollection(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChipsCollection chipsCollection
    ) throws URISyntaxException {
        log.debug("REST request to update ChipsCollection : {}, {}", id, chipsCollection);
        if (chipsCollection.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chipsCollection.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chipsCollectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChipsCollection result = chipsCollectionService.save(chipsCollection);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chipsCollection.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chips-collections/:id} : Partial updates given fields of an existing chipsCollection, field will ignore if it is null
     *
     * @param id the id of the chipsCollection to save.
     * @param chipsCollection the chipsCollection to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chipsCollection,
     * or with status {@code 400 (Bad Request)} if the chipsCollection is not valid,
     * or with status {@code 404 (Not Found)} if the chipsCollection is not found,
     * or with status {@code 500 (Internal Server Error)} if the chipsCollection couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chips-collections/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChipsCollection> partialUpdateChipsCollection(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChipsCollection chipsCollection
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChipsCollection partially : {}, {}", id, chipsCollection);
        if (chipsCollection.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chipsCollection.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chipsCollectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChipsCollection> result = chipsCollectionService.partialUpdate(chipsCollection);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chipsCollection.getId().toString())
        );
    }

    /**
     * {@code GET  /chips-collections} : get all the chipsCollections.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chipsCollections in body.
     */
    @GetMapping("/chips-collections")
    public ResponseEntity<List<ChipsCollection>> getAllChipsCollections(Pageable pageable) {
        log.debug("REST request to get a page of ChipsCollections");
        Page<ChipsCollection> page = chipsCollectionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chips-collections/:id} : get the "id" chipsCollection.
     *
     * @param id the id of the chipsCollection to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chipsCollection, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chips-collections/{id}")
    public ResponseEntity<ChipsCollection> getChipsCollection(@PathVariable Long id) {
        log.debug("REST request to get ChipsCollection : {}", id);
        Optional<ChipsCollection> chipsCollection = chipsCollectionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chipsCollection);
    }

    /**
     * {@code DELETE  /chips-collections/:id} : delete the "id" chipsCollection.
     *
     * @param id the id of the chipsCollection to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chips-collections/{id}")
    public ResponseEntity<Void> deleteChipsCollection(@PathVariable Long id) {
        log.debug("REST request to delete ChipsCollection : {}", id);
        chipsCollectionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
