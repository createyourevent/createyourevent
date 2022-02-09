package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ShopStarRating;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ShopStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopStarRatingExtRepository extends JpaRepository<ShopStarRating, Long> {

    List<ShopStarRating> findByShopId(Long shopId);

    ShopStarRating findByShopIdAndUserId(Long shopId, String userId);

}
