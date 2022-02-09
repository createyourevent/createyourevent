package org.createyourevent.app.service;

import org.createyourevent.app.domain.EventStarRating;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link EventStarRating}.
 */
public interface EventStarRatingExtService {

    List<EventStarRating> findAllEventStarRatingByEventIdAndUserId(Long eventId, String userId);
    List<EventStarRating> findAllEventStarRatingByEventId(Long eventId);
    List<EventStarRating> findAllEventStarRatingByUserId(String userId);

    List<EventStarRating> findAllWhereStarsBiggerAs(Integer stars);
}
