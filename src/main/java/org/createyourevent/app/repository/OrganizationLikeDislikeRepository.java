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
public interface OrganizationLikeDislikeRepository extends JpaRepository<OrganizationLikeDislike, Long> {
    @Query(
        "select organizationLikeDislike from OrganizationLikeDislike organizationLikeDislike where organizationLikeDislike.user.login = ?#{principal.preferredUsername}"
    )
    List<OrganizationLikeDislike> findByUserIsCurrentUser();
}
