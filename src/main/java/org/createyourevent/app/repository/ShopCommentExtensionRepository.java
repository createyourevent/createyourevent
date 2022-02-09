package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ShopComment;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ShopComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopCommentExtensionRepository extends JpaRepository<ShopComment, Long> {

    List<ShopComment> findAllByShopId(Long shopId);
    List<ShopComment> findAllByShopIdAndUserId(Long shopId, String userId);
}
