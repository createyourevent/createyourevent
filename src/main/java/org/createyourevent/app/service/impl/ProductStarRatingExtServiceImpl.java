package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ProductStarRatingExtService;
import org.createyourevent.app.service.ProductStarRatingService;
import org.createyourevent.app.domain.ProductStarRating;
import org.createyourevent.app.repository.ProductStarRatingExtRepository;
import org.createyourevent.app.repository.ProductStarRatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ProductStarRating}.
 */
@Service
@Transactional
public class ProductStarRatingExtServiceImpl implements ProductStarRatingExtService {

    private final Logger log = LoggerFactory.getLogger(ProductStarRatingExtServiceImpl.class);

    private final ProductStarRatingExtRepository productStarRatingExtRepository;

    public ProductStarRatingExtServiceImpl(ProductStarRatingExtRepository productStarRatingExtRepository) {
        this.productStarRatingExtRepository = productStarRatingExtRepository;
    }

    @Override
    public List<ProductStarRating> findProductStarRatingsByProductId(Long productId) {
        log.debug("List<ProductStarRating> findByProductId(Long productId)");
        return productStarRatingExtRepository.findByProductId(productId);
    }

    @Override
    public ProductStarRating findProductStarRatingsByProductIdAndUserId(Long productId, String userId) {
        log.debug("ProductStarRating findByProductIdAndUserId(Long productId, String userId)");
        return productStarRatingExtRepository.findByProductIdAndUserId(productId, userId);
    }


}
