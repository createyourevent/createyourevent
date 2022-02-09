package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.ShopLikeDislike;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ShopLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopLikeDislikeExtensionRepository extends JpaRepository<ShopLikeDislike, Long> {

    List<ShopLikeDislike> findAllByShopId(Long shopId);
    List<ShopLikeDislike> findAllByShopIdAndUserId(Long shopId, String userId);
}
