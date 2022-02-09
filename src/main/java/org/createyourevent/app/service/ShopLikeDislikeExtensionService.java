package org.createyourevent.app.service;

import java.util.List;

import org.createyourevent.app.domain.ShopLikeDislike;

/**
 * Service Interface for managing {@link ShopLikeDislike}.
 */
public interface ShopLikeDislikeExtensionService {

    List<ShopLikeDislike> findAllByShopId(Long shopId);
    List<ShopLikeDislike> findAllByShopIdAndUserId(Long shopId, String userId);
}
