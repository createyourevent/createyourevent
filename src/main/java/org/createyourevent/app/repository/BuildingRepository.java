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
public interface BuildingRepository extends JpaRepository<Building, Long> {
    @Query("select building from Building building where building.user.login = ?#{principal.preferredUsername}")
    List<Building> findByUserIsCurrentUser();
}
