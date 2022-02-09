package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ShopStarRatingExtService;
import org.createyourevent.app.service.ShopStarRatingService;
import org.createyourevent.app.domain.ShopStarRating;
import org.createyourevent.app.repository.ShopStarRatingExtRepository;
import org.createyourevent.app.repository.ShopStarRatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ShopStarRating}.
 */
@Service
@Transactional
public class ShopStarRatingExtServiceImpl implements ShopStarRatingExtService {

    private final Logger log = LoggerFactory.getLogger(ShopStarRatingExtServiceImpl.class);

    private final ShopStarRatingExtRepository shopStarRatingExtRepository;

    public ShopStarRatingExtServiceImpl(ShopStarRatingExtRepository shopStarRatingExtRepository) {
        this.shopStarRatingExtRepository = shopStarRatingExtRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShopStarRating> findShopStarRatingsByShopId(Long shopId) {
        log.debug("findByShopId all ShopStarRatings");
        return shopStarRatingExtRepository.findByShopId(shopId);
    }

    @Override
    public ShopStarRating findByShopIdAndUserId(Long shopId, String userId) {
        log.debug("findByShopIdAndUserId all ShopStarRatings");
        return shopStarRatingExtRepository.findByShopIdAndUserId(shopId, userId);
    }
}


