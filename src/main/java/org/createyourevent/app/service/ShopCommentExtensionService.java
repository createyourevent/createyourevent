package org.createyourevent.app.service;

import java.util.List;

import org.createyourevent.app.domain.ShopComment;

/**
 * Service Interface for managing {@link ShopComment}.
 */
public interface ShopCommentExtensionService {

    List<ShopComment> findAllByShopId(Long shopId);
    List<ShopComment> findAllByShopIdAndUserId(Long shopId, String userId);
    List<ShopComment> findAll();
}
