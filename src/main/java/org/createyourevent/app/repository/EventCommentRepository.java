package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.EventComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventCommentRepository extends JpaRepository<EventComment, Long> {
    @Query("select eventComment from EventComment eventComment where eventComment.user.login = ?#{principal.preferredUsername}")
    List<EventComment> findByUserIsCurrentUser();
}
