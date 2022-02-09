package org.createyourevent.app.repository;

import org.createyourevent.app.domain.EventComment;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the EventComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventCommentExtensionRepository extends JpaRepository<EventComment, Long> {

    List<EventComment> findAllByEventId(Long eventId);
    List<EventComment> findAllByEventIdAndUserId(Long eventId, String userId);
}
