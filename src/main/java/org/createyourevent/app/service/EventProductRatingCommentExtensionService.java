package org.createyourevent.app.service;

import org.createyourevent.app.domain.EventProductRatingComment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link EventProductRatingComment}.
 */
public interface EventProductRatingCommentExtensionService {

    List<EventProductRatingComment> findAllByEventIdAndProductId(Long eventId, Long productId);
}
