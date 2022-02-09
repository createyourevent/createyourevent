package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ProductLikeDislike;
import org.createyourevent.app.repository.ProductLikeDislikeRepository;
import org.createyourevent.app.service.ProductLikeDislikeService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ProductLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class ProductLikeDislikeResource {

    private final Logger log = LoggerFactory.getLogger(ProductLikeDislikeResource.class);

    private static final String ENTITY_NAME = "productLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductLikeDislikeService productLikeDislikeService;

    private final ProductLikeDislikeRepository productLikeDislikeRepository;

    public ProductLikeDislikeResource(
        ProductLikeDislikeService productLikeDislikeService,
        ProductLikeDislikeRepository productLikeDislikeRepository
    ) {
        this.productLikeDislikeService = productLikeDislikeService;
        this.productLikeDislikeRepository = productLikeDislikeRepository;
    }

    /**
     * {@code POST  /product-like-dislikes} : Create a new productLikeDislike.
     *
     * @param productLikeDislike the productLikeDislike to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productLikeDislike, or with status {@code 400 (Bad Request)} if the productLikeDislike has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-like-dislikes")
    public ResponseEntity<ProductLikeDislike> createProductLikeDislike(@RequestBody ProductLikeDislike productLikeDislike)
        throws URISyntaxException {
        log.debug("REST request to save ProductLikeDislike : {}", productLikeDislike);
        if (productLikeDislike.getId() != null) {
            throw new BadRequestAlertException("A new productLikeDislike cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductLikeDislike result = productLikeDislikeService.save(productLikeDislike);
        return ResponseEntity
            .created(new URI("/api/product-like-dislikes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-like-dislikes/:id} : Updates an existing productLikeDislike.
     *
     * @param id the id of the productLikeDislike to save.
     * @param productLikeDislike the productLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productLikeDislike,
     * or with status {@code 400 (Bad Request)} if the productLikeDislike is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-like-dislikes/{id}")
    public ResponseEntity<ProductLikeDislike> updateProductLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductLikeDislike productLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to update ProductLikeDislike : {}, {}", id, productLikeDislike);
        if (productLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductLikeDislike result = productLikeDislikeService.save(productLikeDislike);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productLikeDislike.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /product-like-dislikes/:id} : Partial updates given fields of an existing productLikeDislike, field will ignore if it is null
     *
     * @param id the id of the productLikeDislike to save.
     * @param productLikeDislike the productLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productLikeDislike,
     * or with status {@code 400 (Bad Request)} if the productLikeDislike is not valid,
     * or with status {@code 404 (Not Found)} if the productLikeDislike is not found,
     * or with status {@code 500 (Internal Server Error)} if the productLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/product-like-dislikes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductLikeDislike> partialUpdateProductLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductLikeDislike productLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductLikeDislike partially : {}, {}", id, productLikeDislike);
        if (productLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductLikeDislike> result = productLikeDislikeService.partialUpdate(productLikeDislike);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productLikeDislike.getId().toString())
        );
    }

    /**
     * {@code GET  /product-like-dislikes} : get all the productLikeDislikes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productLikeDislikes in body.
     */
    @GetMapping("/product-like-dislikes")
    public ResponseEntity<List<ProductLikeDislike>> getAllProductLikeDislikes(Pageable pageable) {
        log.debug("REST request to get a page of ProductLikeDislikes");
        Page<ProductLikeDislike> page = productLikeDislikeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-like-dislikes/:id} : get the "id" productLikeDislike.
     *
     * @param id the id of the productLikeDislike to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productLikeDislike, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-like-dislikes/{id}")
    public ResponseEntity<ProductLikeDislike> getProductLikeDislike(@PathVariable Long id) {
        log.debug("REST request to get ProductLikeDislike : {}", id);
        Optional<ProductLikeDislike> productLikeDislike = productLikeDislikeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productLikeDislike);
    }

    /**
     * {@code DELETE  /product-like-dislikes/:id} : delete the "id" productLikeDislike.
     *
     * @param id the id of the productLikeDislike to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-like-dislikes/{id}")
    public ResponseEntity<Void> deleteProductLikeDislike(@PathVariable Long id) {
        log.debug("REST request to delete ProductLikeDislike : {}", id);
        productLikeDislikeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
