package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.EventProductRating;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventProductRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventProductRatingRepository extends JpaRepository<EventProductRating, Long> {
    @Query(
        "select eventProductRating from EventProductRating eventProductRating where eventProductRating.user.login = ?#{principal.preferredUsername}"
    )
    List<EventProductRating> findByUserIsCurrentUser();
}
