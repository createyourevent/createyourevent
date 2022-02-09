package org.createyourevent.app.service;

import org.createyourevent.app.domain.ProductStarRating;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ProductStarRating}.
 */
public interface ProductStarRatingExtService {

    List<ProductStarRating> findProductStarRatingsByProductId(Long productId);

    ProductStarRating findProductStarRatingsByProductIdAndUserId(Long productId, String userId);
}
