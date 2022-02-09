package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.ServiceComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ServiceComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceCommentRepository extends JpaRepository<ServiceComment, Long> {
    @Query("select serviceComment from ServiceComment serviceComment where serviceComment.user.login = ?#{principal.preferredUsername}")
    List<ServiceComment> findByUserIsCurrentUser();
}
