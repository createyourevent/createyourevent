package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ProductComment;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ProductComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductCommentExtensionRepository extends JpaRepository<ProductComment, Long> {

    List<ProductComment> findAllByProductId(Long productId);
    List<ProductComment> findAllByProductIdAndUserId(Long productId, String userId);
}
