package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.OrganizationLikeDislike;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OrganizationLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizationLikeDislikeExtRepository extends JpaRepository<OrganizationLikeDislike, Long> {

    List<OrganizationLikeDislike> findAllByOrganizationId(Long organizationId);
    List<OrganizationLikeDislike> findAllByOrganizationIdAndUserId(Long organizationId, String userId);
}
