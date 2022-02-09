package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ProductStarRating;
import org.createyourevent.app.service.ProductStarRatingExtService;
import org.createyourevent.app.service.ProductStarRatingService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;

import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.ProductStarRating}.
 */
@RestController
@RequestMapping("/api")
public class ProductStarRatingExtResource {

    private final Logger log = LoggerFactory.getLogger(ProductStarRatingExtResource.class);

    private static final String ENTITY_NAME = "productStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductStarRatingExtService productStarRatingExtService;

    public ProductStarRatingExtResource(ProductStarRatingExtService productStarRatingExtService) {
        this.productStarRatingExtService = productStarRatingExtService;
    }


    /**
     * {@code GET  /product-star-ratings} : get all the productStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productStarRatings in body.
     */
    @GetMapping("/product-star-ratings/{productId}/findProductStarRatingsByProductId")
    public List<ProductStarRating> findProductStarRatingsByProductId(@PathVariable Long productId) {
        log.debug("REST request to get a all of ProductStarRatings by productid");
        List<ProductStarRating> all = productStarRatingExtService.findProductStarRatingsByProductId(productId);
        return all;
    }

        /**
     * {@code GET  /product-star-ratings} : get all the productStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productStarRatings in body.
     */
    @GetMapping("/product-star-ratings/{productId}/{userId}/findProductStarRatingsByProductIdAndUserId")
    public ProductStarRating findProductStarRatingsByProductIdAndUserId(@PathVariable Long productId, @PathVariable String userId) {
        log.debug("REST request to get a all of ProductStarRatings by productid and userid");
        ProductStarRating one = productStarRatingExtService.findProductStarRatingsByProductIdAndUserId(productId, userId);
        return one;
    }

}
