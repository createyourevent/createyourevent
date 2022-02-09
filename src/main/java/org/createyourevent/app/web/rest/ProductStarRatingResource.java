package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ProductStarRating;
import org.createyourevent.app.repository.ProductStarRatingRepository;
import org.createyourevent.app.service.ProductStarRatingService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ProductStarRating}.
 */
@RestController
@RequestMapping("/api")
public class ProductStarRatingResource {

    private final Logger log = LoggerFactory.getLogger(ProductStarRatingResource.class);

    private static final String ENTITY_NAME = "productStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductStarRatingService productStarRatingService;

    private final ProductStarRatingRepository productStarRatingRepository;

    public ProductStarRatingResource(
        ProductStarRatingService productStarRatingService,
        ProductStarRatingRepository productStarRatingRepository
    ) {
        this.productStarRatingService = productStarRatingService;
        this.productStarRatingRepository = productStarRatingRepository;
    }

    /**
     * {@code POST  /product-star-ratings} : Create a new productStarRating.
     *
     * @param productStarRating the productStarRating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productStarRating, or with status {@code 400 (Bad Request)} if the productStarRating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-star-ratings")
    public ResponseEntity<ProductStarRating> createProductStarRating(@RequestBody ProductStarRating productStarRating)
        throws URISyntaxException {
        log.debug("REST request to save ProductStarRating : {}", productStarRating);
        if (productStarRating.getId() != null) {
            throw new BadRequestAlertException("A new productStarRating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductStarRating result = productStarRatingService.save(productStarRating);
        return ResponseEntity
            .created(new URI("/api/product-star-ratings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-star-ratings/:id} : Updates an existing productStarRating.
     *
     * @param id the id of the productStarRating to save.
     * @param productStarRating the productStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productStarRating,
     * or with status {@code 400 (Bad Request)} if the productStarRating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-star-ratings/{id}")
    public ResponseEntity<ProductStarRating> updateProductStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductStarRating productStarRating
    ) throws URISyntaxException {
        log.debug("REST request to update ProductStarRating : {}, {}", id, productStarRating);
        if (productStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductStarRating result = productStarRatingService.save(productStarRating);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productStarRating.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /product-star-ratings/:id} : Partial updates given fields of an existing productStarRating, field will ignore if it is null
     *
     * @param id the id of the productStarRating to save.
     * @param productStarRating the productStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productStarRating,
     * or with status {@code 400 (Bad Request)} if the productStarRating is not valid,
     * or with status {@code 404 (Not Found)} if the productStarRating is not found,
     * or with status {@code 500 (Internal Server Error)} if the productStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/product-star-ratings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductStarRating> partialUpdateProductStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductStarRating productStarRating
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductStarRating partially : {}, {}", id, productStarRating);
        if (productStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductStarRating> result = productStarRatingService.partialUpdate(productStarRating);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productStarRating.getId().toString())
        );
    }

    /**
     * {@code GET  /product-star-ratings} : get all the productStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productStarRatings in body.
     */
    @GetMapping("/product-star-ratings")
    public ResponseEntity<List<ProductStarRating>> getAllProductStarRatings(Pageable pageable) {
        log.debug("REST request to get a page of ProductStarRatings");
        Page<ProductStarRating> page = productStarRatingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-star-ratings/:id} : get the "id" productStarRating.
     *
     * @param id the id of the productStarRating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productStarRating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-star-ratings/{id}")
    public ResponseEntity<ProductStarRating> getProductStarRating(@PathVariable Long id) {
        log.debug("REST request to get ProductStarRating : {}", id);
        Optional<ProductStarRating> productStarRating = productStarRatingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productStarRating);
    }

    /**
     * {@code DELETE  /product-star-ratings/:id} : delete the "id" productStarRating.
     *
     * @param id the id of the productStarRating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-star-ratings/{id}")
    public ResponseEntity<Void> deleteProductStarRating(@PathVariable Long id) {
        log.debug("REST request to delete ProductStarRating : {}", id);
        productStarRatingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
