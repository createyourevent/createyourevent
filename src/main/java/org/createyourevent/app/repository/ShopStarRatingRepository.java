package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.ShopStarRating;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ShopStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopStarRatingRepository extends JpaRepository<ShopStarRating, Long> {
    @Query("select shopStarRating from ShopStarRating shopStarRating where shopStarRating.user.login = ?#{principal.preferredUsername}")
    List<ShopStarRating> findByUserIsCurrentUser();
}
