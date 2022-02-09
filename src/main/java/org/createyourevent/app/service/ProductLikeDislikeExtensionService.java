package org.createyourevent.app.service;

import java.util.List;

import org.createyourevent.app.domain.ProductLikeDislike;


/**
 * Service Interface for managing {@link ProductLikeDislike}.
 */
public interface ProductLikeDislikeExtensionService {
    List<ProductLikeDislike> findAllByProductId(Long productId);
    List<ProductLikeDislike> findAllByProductIdAndUserId(Long productId, String userId);
}
