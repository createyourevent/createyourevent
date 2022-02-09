package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ProductStarRating;
import org.createyourevent.app.repository.ProductStarRatingRepository;
import org.createyourevent.app.service.ProductStarRatingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ProductStarRating}.
 */
@Service
@Transactional
public class ProductStarRatingServiceImpl implements ProductStarRatingService {

    private final Logger log = LoggerFactory.getLogger(ProductStarRatingServiceImpl.class);

    private final ProductStarRatingRepository productStarRatingRepository;

    public ProductStarRatingServiceImpl(ProductStarRatingRepository productStarRatingRepository) {
        this.productStarRatingRepository = productStarRatingRepository;
    }

    @Override
    public ProductStarRating save(ProductStarRating productStarRating) {
        log.debug("Request to save ProductStarRating : {}", productStarRating);
        return productStarRatingRepository.save(productStarRating);
    }

    @Override
    public Optional<ProductStarRating> partialUpdate(ProductStarRating productStarRating) {
        log.debug("Request to partially update ProductStarRating : {}", productStarRating);

        return productStarRatingRepository
            .findById(productStarRating.getId())
            .map(existingProductStarRating -> {
                if (productStarRating.getStars() != null) {
                    existingProductStarRating.setStars(productStarRating.getStars());
                }
                if (productStarRating.getDate() != null) {
                    existingProductStarRating.setDate(productStarRating.getDate());
                }
                if (productStarRating.getComment() != null) {
                    existingProductStarRating.setComment(productStarRating.getComment());
                }

                return existingProductStarRating;
            })
            .map(productStarRatingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductStarRating> findAll(Pageable pageable) {
        log.debug("Request to get all ProductStarRatings");
        return productStarRatingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductStarRating> findOne(Long id) {
        log.debug("Request to get ProductStarRating : {}", id);
        return productStarRatingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ProductStarRating : {}", id);
        productStarRatingRepository.deleteById(id);
    }
}
