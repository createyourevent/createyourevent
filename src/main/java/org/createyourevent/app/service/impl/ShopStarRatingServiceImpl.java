package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ShopStarRating;
import org.createyourevent.app.repository.ShopStarRatingRepository;
import org.createyourevent.app.service.ShopStarRatingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ShopStarRating}.
 */
@Service
@Transactional
public class ShopStarRatingServiceImpl implements ShopStarRatingService {

    private final Logger log = LoggerFactory.getLogger(ShopStarRatingServiceImpl.class);

    private final ShopStarRatingRepository shopStarRatingRepository;

    public ShopStarRatingServiceImpl(ShopStarRatingRepository shopStarRatingRepository) {
        this.shopStarRatingRepository = shopStarRatingRepository;
    }

    @Override
    public ShopStarRating save(ShopStarRating shopStarRating) {
        log.debug("Request to save ShopStarRating : {}", shopStarRating);
        return shopStarRatingRepository.save(shopStarRating);
    }

    @Override
    public Optional<ShopStarRating> partialUpdate(ShopStarRating shopStarRating) {
        log.debug("Request to partially update ShopStarRating : {}", shopStarRating);

        return shopStarRatingRepository
            .findById(shopStarRating.getId())
            .map(existingShopStarRating -> {
                if (shopStarRating.getStars() != null) {
                    existingShopStarRating.setStars(shopStarRating.getStars());
                }
                if (shopStarRating.getDate() != null) {
                    existingShopStarRating.setDate(shopStarRating.getDate());
                }
                if (shopStarRating.getComment() != null) {
                    existingShopStarRating.setComment(shopStarRating.getComment());
                }

                return existingShopStarRating;
            })
            .map(shopStarRatingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ShopStarRating> findAll(Pageable pageable) {
        log.debug("Request to get all ShopStarRatings");
        return shopStarRatingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ShopStarRating> findOne(Long id) {
        log.debug("Request to get ShopStarRating : {}", id);
        return shopStarRatingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ShopStarRating : {}", id);
        shopStarRatingRepository.deleteById(id);
    }
}
