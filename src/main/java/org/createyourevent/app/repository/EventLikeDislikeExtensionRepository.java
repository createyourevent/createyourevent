package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.EventLikeDislike;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the EventLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventLikeDislikeExtensionRepository extends JpaRepository<EventLikeDislike, Long> {
    List<EventLikeDislike> findAllByEventId(Long eventId);
    List<EventLikeDislike> findAllByEventIdAndUserId(Long eventId, String userId);
}
