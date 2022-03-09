package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Coupon;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Coupon entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    @Query("select coupon from Coupon coupon where coupon.user.login = ?#{principal.preferredUsername}")
    List<Coupon> findByUserIsCurrentUser();
}
