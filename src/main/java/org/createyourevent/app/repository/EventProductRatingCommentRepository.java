package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.EventProductRatingComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventProductRatingComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventProductRatingCommentRepository extends JpaRepository<EventProductRatingComment, Long> {
    @Query(
        "select eventProductRatingComment from EventProductRatingComment eventProductRatingComment where eventProductRatingComment.user.login = ?#{principal.preferredUsername}"
    )
    List<EventProductRatingComment> findByUserIsCurrentUser();
}
