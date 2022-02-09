package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.ServiceStarRating;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ServiceStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceStarRatingRepository extends JpaRepository<ServiceStarRating, Long> {
    @Query(
        "select serviceStarRating from ServiceStarRating serviceStarRating where serviceStarRating.user.login = ?#{principal.preferredUsername}"
    )
    List<ServiceStarRating> findByUserIsCurrentUser();
}
