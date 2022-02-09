package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Organization;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Organization entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    @Query("select organization from Organization organization where organization.user.login = ?#{principal.preferredUsername}")
    List<Organization> findByUserIsCurrentUser();
}
