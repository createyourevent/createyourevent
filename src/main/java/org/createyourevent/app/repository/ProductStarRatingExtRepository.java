package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ProductStarRating;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ProductStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductStarRatingExtRepository extends JpaRepository<ProductStarRating, Long> {

    List<ProductStarRating> findByProductId(Long productId);

    ProductStarRating findByProductIdAndUserId(Long productId, String userId);
}
