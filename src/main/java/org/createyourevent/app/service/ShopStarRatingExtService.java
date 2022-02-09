package org.createyourevent.app.service;

import org.createyourevent.app.domain.ShopStarRating;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ShopStarRating}.
 */
public interface ShopStarRatingExtService {
    List<ShopStarRating> findShopStarRatingsByShopId(Long shopId);

    ShopStarRating findByShopIdAndUserId(Long shopId, String userId);
}
