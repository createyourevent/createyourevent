package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Coupon}.
 */
public interface CouponExtService {
    List<Coupon> findByUserIsCurrentUser();
    List<Coupon> findByUserId(String userId);
}
