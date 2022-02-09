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
public interface OrganizationCommentExtRepository extends JpaRepository<OrganizationComment, Long> {
    List<OrganizationComment> findAllByOrganizationId(Long organizationId);
    List<OrganizationComment> findAllByOrganizationIdAndUserId(Long organizationId, String userId);
}
