package org.createyourevent.app.service;

import org.createyourevent.app.domain.ProductComment;

import java.util.List;

/**
 * Service Interface for managing {@link ProductComment}.
 */
public interface ProductCommentExtensionService {

    List<ProductComment> findAllByProductId(Long productId);
    List<ProductComment> findAllByProductIdAndUserId(Long productId, String userId);
}
