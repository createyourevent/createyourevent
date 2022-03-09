package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Coupon}.
 */
public interface CouponService {
    /**
     * Save a coupon.
     *
     * @param coupon the entity to save.
     * @return the persisted entity.
     */
    Coupon save(Coupon coupon);

    /**
     * Partially updates a coupon.
     *
     * @param coupon the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Coupon> partialUpdate(Coupon coupon);

    /**
     * Get all the coupons.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Coupon> findAll(Pageable pageable);

    /**
     * Get the "id" coupon.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Coupon> findOne(Long id);

    /**
     * Delete the "id" coupon.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
