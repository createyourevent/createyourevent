package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.EventProductRating;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the EventProductRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventProductRatingExtensionRepository extends JpaRepository<EventProductRating, Long> {

    EventProductRating findByEventIdAndProductIdAndUserId(Long eventId, Long productId, String userId);

    List<EventProductRating> findAllByEventIdAndProductId(Long eventId, Long productId);
}
