package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ShopLikeDislike;
import org.createyourevent.app.repository.ShopLikeDislikeRepository;
import org.createyourevent.app.service.ShopLikeDislikeService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ShopLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class ShopLikeDislikeResource {

    private final Logger log = LoggerFactory.getLogger(ShopLikeDislikeResource.class);

    private static final String ENTITY_NAME = "shopLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShopLikeDislikeService shopLikeDislikeService;

    private final ShopLikeDislikeRepository shopLikeDislikeRepository;

    public ShopLikeDislikeResource(ShopLikeDislikeService shopLikeDislikeService, ShopLikeDislikeRepository shopLikeDislikeRepository) {
        this.shopLikeDislikeService = shopLikeDislikeService;
        this.shopLikeDislikeRepository = shopLikeDislikeRepository;
    }

    /**
     * {@code POST  /shop-like-dislikes} : Create a new shopLikeDislike.
     *
     * @param shopLikeDislike the shopLikeDislike to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shopLikeDislike, or with status {@code 400 (Bad Request)} if the shopLikeDislike has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shop-like-dislikes")
    public ResponseEntity<ShopLikeDislike> createShopLikeDislike(@RequestBody ShopLikeDislike shopLikeDislike) throws URISyntaxException {
        log.debug("REST request to save ShopLikeDislike : {}", shopLikeDislike);
        if (shopLikeDislike.getId() != null) {
            throw new BadRequestAlertException("A new shopLikeDislike cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShopLikeDislike result = shopLikeDislikeService.save(shopLikeDislike);
        return ResponseEntity
            .created(new URI("/api/shop-like-dislikes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shop-like-dislikes/:id} : Updates an existing shopLikeDislike.
     *
     * @param id the id of the shopLikeDislike to save.
     * @param shopLikeDislike the shopLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shopLikeDislike,
     * or with status {@code 400 (Bad Request)} if the shopLikeDislike is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shopLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shop-like-dislikes/{id}")
    public ResponseEntity<ShopLikeDislike> updateShopLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShopLikeDislike shopLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to update ShopLikeDislike : {}, {}", id, shopLikeDislike);
        if (shopLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shopLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shopLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ShopLikeDislike result = shopLikeDislikeService.save(shopLikeDislike);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shopLikeDislike.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shop-like-dislikes/:id} : Partial updates given fields of an existing shopLikeDislike, field will ignore if it is null
     *
     * @param id the id of the shopLikeDislike to save.
     * @param shopLikeDislike the shopLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shopLikeDislike,
     * or with status {@code 400 (Bad Request)} if the shopLikeDislike is not valid,
     * or with status {@code 404 (Not Found)} if the shopLikeDislike is not found,
     * or with status {@code 500 (Internal Server Error)} if the shopLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/shop-like-dislikes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ShopLikeDislike> partialUpdateShopLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShopLikeDislike shopLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to partial update ShopLikeDislike partially : {}, {}", id, shopLikeDislike);
        if (shopLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shopLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shopLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ShopLikeDislike> result = shopLikeDislikeService.partialUpdate(shopLikeDislike);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shopLikeDislike.getId().toString())
        );
    }

    /**
     * {@code GET  /shop-like-dislikes} : get all the shopLikeDislikes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopLikeDislikes in body.
     */
    @GetMapping("/shop-like-dislikes")
    public ResponseEntity<List<ShopLikeDislike>> getAllShopLikeDislikes(Pageable pageable) {
        log.debug("REST request to get a page of ShopLikeDislikes");
        Page<ShopLikeDislike> page = shopLikeDislikeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /shop-like-dislikes/:id} : get the "id" shopLikeDislike.
     *
     * @param id the id of the shopLikeDislike to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shopLikeDislike, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shop-like-dislikes/{id}")
    public ResponseEntity<ShopLikeDislike> getShopLikeDislike(@PathVariable Long id) {
        log.debug("REST request to get ShopLikeDislike : {}", id);
        Optional<ShopLikeDislike> shopLikeDislike = shopLikeDislikeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(shopLikeDislike);
    }

    /**
     * {@code DELETE  /shop-like-dislikes/:id} : delete the "id" shopLikeDislike.
     *
     * @param id the id of the shopLikeDislike to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shop-like-dislikes/{id}")
    public ResponseEntity<Void> deleteShopLikeDislike(@PathVariable Long id) {
        log.debug("REST request to delete ShopLikeDislike : {}", id);
        shopLikeDislikeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
