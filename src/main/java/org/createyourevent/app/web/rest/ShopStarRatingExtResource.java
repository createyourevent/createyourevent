package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ShopStarRating;
import org.createyourevent.app.service.ShopStarRatingExtService;
import org.createyourevent.app.service.ShopStarRatingService;
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
 * REST controller for managing {@link org.createyourevent.domain.ShopStarRating}.
 */
@RestController
@RequestMapping("/api")
public class ShopStarRatingExtResource {

    private final Logger log = LoggerFactory.getLogger(ShopStarRatingExtResource.class);

    private static final String ENTITY_NAME = "shopStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShopStarRatingExtService shopStarRatingExtService;

    public ShopStarRatingExtResource(ShopStarRatingExtService shopStarRatingExtService) {
        this.shopStarRatingExtService = shopStarRatingExtService;
    }



    /**
     * {@code GET  /shop-star-ratings} : get all the shopStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopStarRatings in body.
     */
    @GetMapping("/shop-star-ratings/{shopId}/findShopStarRatingsByShopId")
    public List<ShopStarRating> findShopStarRatingsByShopId(@PathVariable Long shopId) {
        log.debug("REST request to get a all of ShopStarRatings by shopid");
        List<ShopStarRating> all = shopStarRatingExtService.findShopStarRatingsByShopId(shopId);
        return all;
    }

        /**
     * {@code GET  /shop-star-ratings} : get all the shopStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopStarRatings in body.
     */
    @GetMapping("/shop-star-ratings/{shopId}/{userId}/findShopStarRatingsByShopIdAndUserId")
    public ShopStarRating findShopStarRatingsByShopIdAndUserId(@PathVariable Long shopId, @PathVariable String userId) {
        log.debug("REST request to get a all of ShopStarRatings by shopid and userid");
        ShopStarRating one = shopStarRatingExtService.findByShopIdAndUserId(shopId, userId);
        return one;
    }
}


