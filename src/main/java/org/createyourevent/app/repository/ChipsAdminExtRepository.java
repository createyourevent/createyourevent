package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ChipsAdmin;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ChipsAdmin entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChipsAdminExtRepository extends JpaRepository<ChipsAdmin, Long> {

@Query(
  value = "DELETE FROM createyourevent.chips_collection_chips",
  nativeQuery = true)
void deleteAllFoundedChips();
}
