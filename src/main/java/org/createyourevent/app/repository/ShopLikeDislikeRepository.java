package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.ShopLikeDislike;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ShopLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopLikeDislikeRepository extends JpaRepository<ShopLikeDislike, Long> {
    @Query("select shopLikeDislike from ShopLikeDislike shopLikeDislike where shopLikeDislike.user.login = ?#{principal.preferredUsername}")
    List<ShopLikeDislike> findByUserIsCurrentUser();
}
