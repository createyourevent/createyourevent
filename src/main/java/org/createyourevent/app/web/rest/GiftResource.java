package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.createyourevent.app.domain.Gift;
import org.createyourevent.app.repository.GiftRepository;
import org.createyourevent.app.service.GiftService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.Gift}.
 */
@RestController
@RequestMapping("/api")
public class GiftResource {

    private final Logger log = LoggerFactory.getLogger(GiftResource.class);

    private static final String ENTITY_NAME = "gift";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GiftService giftService;

    private final GiftRepository giftRepository;

    public GiftResource(GiftService giftService, GiftRepository giftRepository) {
        this.giftService = giftService;
        this.giftRepository = giftRepository;
    }

    /**
     * {@code POST  /gifts} : Create a new gift.
     *
     * @param gift the gift to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gift, or with status {@code 400 (Bad Request)} if the gift has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/gifts")
    public ResponseEntity<Gift> createGift(@Valid @RequestBody Gift gift) throws URISyntaxException {
        log.debug("REST request to save Gift : {}", gift);
        if (gift.getId() != null) {
            throw new BadRequestAlertException("A new gift cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Gift result = giftService.save(gift);
        return ResponseEntity
            .created(new URI("/api/gifts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /gifts/:id} : Updates an existing gift.
     *
     * @param id the id of the gift to save.
     * @param gift the gift to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gift,
     * or with status {@code 400 (Bad Request)} if the gift is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gift couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/gifts/{id}")
    public ResponseEntity<Gift> updateGift(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Gift gift)
        throws URISyntaxException {
        log.debug("REST request to update Gift : {}, {}", id, gift);
        if (gift.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gift.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!giftRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Gift result = giftService.save(gift);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gift.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /gifts/:id} : Partial updates given fields of an existing gift, field will ignore if it is null
     *
     * @param id the id of the gift to save.
     * @param gift the gift to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gift,
     * or with status {@code 400 (Bad Request)} if the gift is not valid,
     * or with status {@code 404 (Not Found)} if the gift is not found,
     * or with status {@code 500 (Internal Server Error)} if the gift couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/gifts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Gift> partialUpdateGift(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Gift gift
    ) throws URISyntaxException {
        log.debug("REST request to partial update Gift partially : {}, {}", id, gift);
        if (gift.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gift.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!giftRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Gift> result = giftService.partialUpdate(gift);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gift.getId().toString())
        );
    }

    /**
     * {@code GET  /gifts} : get all the gifts.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gifts in body.
     */
    @GetMapping("/gifts")
    public ResponseEntity<List<Gift>> getAllGifts(Pageable pageable) {
        log.debug("REST request to get a page of Gifts");
        Page<Gift> page = giftService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /gifts/:id} : get the "id" gift.
     *
     * @param id the id of the gift to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gift, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/gifts/{id}")
    public ResponseEntity<Gift> getGift(@PathVariable Long id) {
        log.debug("REST request to get Gift : {}", id);
        Optional<Gift> gift = giftService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gift);
    }

    /**
     * {@code DELETE  /gifts/:id} : delete the "id" gift.
     *
     * @param id the id of the gift to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/gifts/{id}")
    public ResponseEntity<Void> deleteGift(@PathVariable Long id) {
        log.debug("REST request to delete Gift : {}", id);
        giftService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
