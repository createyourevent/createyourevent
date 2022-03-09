package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Coupon;
import org.createyourevent.app.repository.CouponExtRepository;
import org.createyourevent.app.repository.CouponRepository;
import org.createyourevent.app.service.CouponExtService;
import org.createyourevent.app.service.CouponService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.Coupon}.
 */
@RestController
@RequestMapping("/api")
public class CouponExtResource {

    private final Logger log = LoggerFactory.getLogger(CouponExtResource.class);

    private static final String ENTITY_NAME = "coupon";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CouponExtService couponExtService;

    private final CouponExtRepository couponExtRepository;

    public CouponExtResource(CouponExtService couponExtService, CouponExtRepository couponExtRepository) {
        this.couponExtService = couponExtService;
        this.couponExtRepository = couponExtRepository;
    }

    /**
     * {@code GET  /coupons} : get all the coupons.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of coupons in body.
     */
    @GetMapping("/coupons/byUser")
    public List<Coupon> getAllCouponsByUser() {
        log.debug("REST request to get a page of Coupons");
        List<Coupon> l = this.couponExtService.findByUserIsCurrentUser();
        return l;
    }

    @GetMapping("/coupons/{userId}/byUser")
    public List<Coupon> getAllCouponsByUser(@PathVariable String userId) {
        log.debug("REST request to get a page of Coupons");
        List<Coupon> l = this.couponExtService.findByUserId(userId);
        return l;
    }
}
