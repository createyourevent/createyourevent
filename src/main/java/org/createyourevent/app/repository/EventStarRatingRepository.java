package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.EventStarRating;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventStarRatingRepository extends JpaRepository<EventStarRating, Long> {
    @Query("select eventStarRating from EventStarRating eventStarRating where eventStarRating.user.login = ?#{principal.preferredUsername}")
    List<EventStarRating> findByUserIsCurrentUser();
}
