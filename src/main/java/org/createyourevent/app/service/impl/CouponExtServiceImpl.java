package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Coupon;
import org.createyourevent.app.repository.CouponExtRepository;
import org.createyourevent.app.repository.CouponRepository;
import org.createyourevent.app.service.CouponExtService;
import org.createyourevent.app.service.CouponService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Coupon}.
 */
@Service
@Transactional
public class CouponExtServiceImpl implements CouponExtService {

    private final Logger log = LoggerFactory.getLogger(CouponServiceImpl.class);

    private final CouponExtRepository couponExtRepository;

    public CouponExtServiceImpl(CouponExtRepository couponExtRepository) {
        this.couponExtRepository = couponExtRepository;
    }

    @Override
    public List<Coupon> findByUserIsCurrentUser() {
        // TODO Auto-generated method stub
        return couponExtRepository.findByUserIsCurrentUser();
    }

    @Override
    public List<Coupon> findByUserId(String userId) {
        return couponExtRepository.findByUserId(userId);
    }
}
