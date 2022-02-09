package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.EventLikeDislike;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventLikeDislikeRepository extends JpaRepository<EventLikeDislike, Long> {
    @Query(
        "select eventLikeDislike from EventLikeDislike eventLikeDislike where eventLikeDislike.user.login = ?#{principal.preferredUsername}"
    )
    List<EventLikeDislike> findByUserIsCurrentUser();
}
