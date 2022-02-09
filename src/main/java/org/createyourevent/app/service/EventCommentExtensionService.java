package org.createyourevent.app.service;

import org.createyourevent.app.domain.EventComment;



import java.util.List;

/**
 * Service Interface for managing {@link EventComment}.
 */
public interface EventCommentExtensionService {

    List<EventComment> findAllByEventId(Long eventId);
    List<EventComment> findAllByEventIdAndUserId(Long eventId, String userId);
}
