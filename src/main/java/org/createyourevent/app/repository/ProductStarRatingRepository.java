package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.ProductStarRating;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductStarRatingRepository extends JpaRepository<ProductStarRating, Long> {
    @Query(
        "select productStarRating from ProductStarRating productStarRating where productStarRating.user.login = ?#{principal.preferredUsername}"
    )
    List<ProductStarRating> findByUserIsCurrentUser();
}
