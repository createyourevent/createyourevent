package org.createyourevent.app.service;

import java.util.List;

import org.createyourevent.app.domain.EventProductRating;

/**
 * Service Interface for managing {@link EventProductRating}.
 */
public interface EventProductRatingExtensionService {

    EventProductRating findByEventIdAndProductIdAndUserId(Long eventId, Long productId, String userId);

    List<EventProductRating> findAllByEventIdAndProductId(Long eventId, Long productId);
}
