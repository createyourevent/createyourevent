package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ShopComment;
import org.createyourevent.app.repository.ShopCommentRepository;
import org.createyourevent.app.service.ShopCommentService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ShopComment}.
 */
@RestController
@RequestMapping("/api")
public class ShopCommentResource {

    private final Logger log = LoggerFactory.getLogger(ShopCommentResource.class);

    private static final String ENTITY_NAME = "shopComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShopCommentService shopCommentService;

    private final ShopCommentRepository shopCommentRepository;

    public ShopCommentResource(ShopCommentService shopCommentService, ShopCommentRepository shopCommentRepository) {
        this.shopCommentService = shopCommentService;
        this.shopCommentRepository = shopCommentRepository;
    }

    /**
     * {@code POST  /shop-comments} : Create a new shopComment.
     *
     * @param shopComment the shopComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shopComment, or with status {@code 400 (Bad Request)} if the shopComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shop-comments")
    public ResponseEntity<ShopComment> createShopComment(@RequestBody ShopComment shopComment) throws URISyntaxException {
        log.debug("REST request to save ShopComment : {}", shopComment);
        if (shopComment.getId() != null) {
            throw new BadRequestAlertException("A new shopComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShopComment result = shopCommentService.save(shopComment);
        return ResponseEntity
            .created(new URI("/api/shop-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shop-comments/:id} : Updates an existing shopComment.
     *
     * @param id the id of the shopComment to save.
     * @param shopComment the shopComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shopComment,
     * or with status {@code 400 (Bad Request)} if the shopComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shopComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shop-comments/{id}")
    public ResponseEntity<ShopComment> updateShopComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShopComment shopComment
    ) throws URISyntaxException {
        log.debug("REST request to update ShopComment : {}, {}", id, shopComment);
        if (shopComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shopComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shopCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ShopComment result = shopCommentService.save(shopComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shopComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shop-comments/:id} : Partial updates given fields of an existing shopComment, field will ignore if it is null
     *
     * @param id the id of the shopComment to save.
     * @param shopComment the shopComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shopComment,
     * or with status {@code 400 (Bad Request)} if the shopComment is not valid,
     * or with status {@code 404 (Not Found)} if the shopComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the shopComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/shop-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ShopComment> partialUpdateShopComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShopComment shopComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update ShopComment partially : {}, {}", id, shopComment);
        if (shopComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shopComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shopCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ShopComment> result = shopCommentService.partialUpdate(shopComment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shopComment.getId().toString())
        );
    }

    /**
     * {@code GET  /shop-comments} : get all the shopComments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopComments in body.
     */
    @GetMapping("/shop-comments")
    public ResponseEntity<List<ShopComment>> getAllShopComments(Pageable pageable) {
        log.debug("REST request to get a page of ShopComments");
        Page<ShopComment> page = shopCommentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /shop-comments/:id} : get the "id" shopComment.
     *
     * @param id the id of the shopComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shopComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shop-comments/{id}")
    public ResponseEntity<ShopComment> getShopComment(@PathVariable Long id) {
        log.debug("REST request to get ShopComment : {}", id);
        Optional<ShopComment> shopComment = shopCommentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(shopComment);
    }

    /**
     * {@code DELETE  /shop-comments/:id} : delete the "id" shopComment.
     *
     * @param id the id of the shopComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shop-comments/{id}")
    public ResponseEntity<Void> deleteShopComment(@PathVariable Long id) {
        log.debug("REST request to delete ShopComment : {}", id);
        shopCommentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
