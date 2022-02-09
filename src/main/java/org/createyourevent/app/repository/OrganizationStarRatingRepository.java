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
public interface OrganizationStarRatingRepository extends JpaRepository<OrganizationStarRating, Long> {
    @Query(
        "select organizationStarRating from OrganizationStarRating organizationStarRating where organizationStarRating.user.login = ?#{principal.preferredUsername}"
    )
    List<OrganizationStarRating> findByUserIsCurrentUser();
}
