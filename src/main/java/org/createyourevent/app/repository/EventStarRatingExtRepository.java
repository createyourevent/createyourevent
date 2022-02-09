package org.createyourevent.app.repository;

import org.createyourevent.app.domain.EventStarRating;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the EventStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventStarRatingExtRepository extends JpaRepository<EventStarRating, Long> {

    List<EventStarRating> findAllByEventIdAndUserId(Long eventId, String userId);
    List<EventStarRating> findAllByEventId(Long eventId);
    List<EventStarRating> findAllByUserId(String userId);

    @Query("select eventStarRating from EventStarRating eventStarRating where eventStarRating.stars >= :stars")
    List<EventStarRating> findAllWhereStarsBiggerAs(@Param("stars") Integer stars);
}
