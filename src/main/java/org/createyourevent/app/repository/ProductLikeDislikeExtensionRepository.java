package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.ProductLikeDislike;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ProductLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductLikeDislikeExtensionRepository extends JpaRepository<ProductLikeDislike, Long> {

    List<ProductLikeDislike> findAllByProductId(Long productId);
    List<ProductLikeDislike> findAllByProductIdAndUserId(Long productId, String userId);

}
