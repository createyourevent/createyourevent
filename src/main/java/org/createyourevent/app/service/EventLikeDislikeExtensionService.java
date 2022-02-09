package org.createyourevent.app.service;

import org.createyourevent.app.domain.EventLikeDislike;

import java.util.List;

/**
 * Service Interface for managing {@link EventLikeDislike}.
 */
public interface EventLikeDislikeExtensionService {
    List<EventLikeDislike> findAllByEventId(Long eventId);
    List<EventLikeDislike> findAllByEventIdAndUserId(Long eventId, String userId);
}
