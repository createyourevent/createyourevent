package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ShopStarRating;
import org.createyourevent.app.repository.ShopStarRatingRepository;
import org.createyourevent.app.service.ShopStarRatingService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ShopStarRating}.
 */
@RestController
@RequestMapping("/api")
public class ShopStarRatingResource {

    private final Logger log = LoggerFactory.getLogger(ShopStarRatingResource.class);

    private static final String ENTITY_NAME = "shopStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShopStarRatingService shopStarRatingService;

    private final ShopStarRatingRepository shopStarRatingRepository;

    public ShopStarRatingResource(ShopStarRatingService shopStarRatingService, ShopStarRatingRepository shopStarRatingRepository) {
        this.shopStarRatingService = shopStarRatingService;
        this.shopStarRatingRepository = shopStarRatingRepository;
    }

    /**
     * {@code POST  /shop-star-ratings} : Create a new shopStarRating.
     *
     * @param shopStarRating the shopStarRating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shopStarRating, or with status {@code 400 (Bad Request)} if the shopStarRating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shop-star-ratings")
    public ResponseEntity<ShopStarRating> createShopStarRating(@RequestBody ShopStarRating shopStarRating) throws URISyntaxException {
        log.debug("REST request to save ShopStarRating : {}", shopStarRating);
        if (shopStarRating.getId() != null) {
            throw new BadRequestAlertException("A new shopStarRating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShopStarRating result = shopStarRatingService.save(shopStarRating);
        return ResponseEntity
            .created(new URI("/api/shop-star-ratings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shop-star-ratings/:id} : Updates an existing shopStarRating.
     *
     * @param id the id of the shopStarRating to save.
     * @param shopStarRating the shopStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shopStarRating,
     * or with status {@code 400 (Bad Request)} if the shopStarRating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shopStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shop-star-ratings/{id}")
    public ResponseEntity<ShopStarRating> updateShopStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShopStarRating shopStarRating
    ) throws URISyntaxException {
        log.debug("REST request to update ShopStarRating : {}, {}", id, shopStarRating);
        if (shopStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shopStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shopStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ShopStarRating result = shopStarRatingService.save(shopStarRating);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shopStarRating.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shop-star-ratings/:id} : Partial updates given fields of an existing shopStarRating, field will ignore if it is null
     *
     * @param id the id of the shopStarRating to save.
     * @param shopStarRating the shopStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shopStarRating,
     * or with status {@code 400 (Bad Request)} if the shopStarRating is not valid,
     * or with status {@code 404 (Not Found)} if the shopStarRating is not found,
     * or with status {@code 500 (Internal Server Error)} if the shopStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/shop-star-ratings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ShopStarRating> partialUpdateShopStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShopStarRating shopStarRating
    ) throws URISyntaxException {
        log.debug("REST request to partial update ShopStarRating partially : {}, {}", id, shopStarRating);
        if (shopStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shopStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shopStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ShopStarRating> result = shopStarRatingService.partialUpdate(shopStarRating);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shopStarRating.getId().toString())
        );
    }

    /**
     * {@code GET  /shop-star-ratings} : get all the shopStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopStarRatings in body.
     */
    @GetMapping("/shop-star-ratings")
    public ResponseEntity<List<ShopStarRating>> getAllShopStarRatings(Pageable pageable) {
        log.debug("REST request to get a page of ShopStarRatings");
        Page<ShopStarRating> page = shopStarRatingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /shop-star-ratings/:id} : get the "id" shopStarRating.
     *
     * @param id the id of the shopStarRating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shopStarRating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shop-star-ratings/{id}")
    public ResponseEntity<ShopStarRating> getShopStarRating(@PathVariable Long id) {
        log.debug("REST request to get ShopStarRating : {}", id);
        Optional<ShopStarRating> shopStarRating = shopStarRatingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(shopStarRating);
    }

    /**
     * {@code DELETE  /shop-star-ratings/:id} : delete the "id" shopStarRating.
     *
     * @param id the id of the shopStarRating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shop-star-ratings/{id}")
    public ResponseEntity<Void> deleteShopStarRating(@PathVariable Long id) {
        log.debug("REST request to delete ShopStarRating : {}", id);
        shopStarRatingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
