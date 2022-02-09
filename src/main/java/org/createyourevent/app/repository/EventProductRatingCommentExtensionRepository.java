package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.Event;
import org.createyourevent.app.domain.EventProductRatingComment;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the EventProductRatingComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventProductRatingCommentExtensionRepository extends JpaRepository<EventProductRatingComment, Long> {

    List<EventProductRatingComment> findAllByEventIdAndProductId(Long eventId, Long productId);
}
