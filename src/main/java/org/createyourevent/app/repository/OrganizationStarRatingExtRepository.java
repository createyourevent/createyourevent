package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.OrganizationStarRating;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OrganizationStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizationStarRatingExtRepository extends JpaRepository<OrganizationStarRating, Long> {
    List<OrganizationStarRating> findByOrganizationId(Long organizationId);
    OrganizationStarRating findByOrganizationIdAndUserId(Long organizationId, String userId);
}
