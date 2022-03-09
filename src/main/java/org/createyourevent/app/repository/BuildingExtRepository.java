package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Building;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Building entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BuildingExtRepository extends JpaRepository<Building, Long> {
    @Query("select b from Building b where b.user.login = ?#{principal.preferredUsername} and b.organization.active = true")
    List<Building> findByUserIsCurrentUserAndActive();

    Building findByOrganizationId(Long id);
}
