package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Coupon;
import org.createyourevent.app.repository.CouponRepository;
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
public class CouponServiceImpl implements CouponService {

    private final Logger log = LoggerFactory.getLogger(CouponServiceImpl.class);

    private final CouponRepository couponRepository;

    public CouponServiceImpl(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    public Coupon save(Coupon coupon) {
        log.debug("Request to save Coupon : {}", coupon);
        return couponRepository.save(coupon);
    }

    @Override
    public Optional<Coupon> partialUpdate(Coupon coupon) {
        log.debug("Request to partially update Coupon : {}", coupon);

        return couponRepository
            .findById(coupon.getId())
            .map(existingCoupon -> {
                if (coupon.getTitle() != null) {
                    existingCoupon.setTitle(coupon.getTitle());
                }
                if (coupon.getValue() != null) {
                    existingCoupon.setValue(coupon.getValue());
                }
                if (coupon.getDescription() != null) {
                    existingCoupon.setDescription(coupon.getDescription());
                }
                if (coupon.getCouponNr() != null) {
                    existingCoupon.setCouponNr(coupon.getCouponNr());
                }
                if (coupon.getUsed() != null) {
                    existingCoupon.setUsed(coupon.getUsed());
                }

                return existingCoupon;
            })
            .map(couponRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Coupon> findAll(Pageable pageable) {
        log.debug("Request to get all Coupons");
        return couponRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Coupon> findOne(Long id) {
        log.debug("Request to get Coupon : {}", id);
        return couponRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Coupon : {}", id);
        couponRepository.deleteById(id);
    }
}
