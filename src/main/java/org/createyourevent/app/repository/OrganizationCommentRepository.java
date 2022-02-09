package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.OrganizationComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OrganizationComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizationCommentRepository extends JpaRepository<OrganizationComment, Long> {
    @Query(
        "select organizationComment from OrganizationComment organizationComment where organizationComment.user.login = ?#{principal.preferredUsername}"
    )
    List<OrganizationComment> findByUserIsCurrentUser();
}
