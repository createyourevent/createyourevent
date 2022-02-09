package org.createyourevent.app.repository;

import org.createyourevent.app.domain.Chips;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;

/**
 * Spring Data  repository for the Chips entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChipsExtRepository extends JpaRepository<Chips, Long> {

    @Modifying
    @Query(value = "DELETE FROM createyourevent.chips_collection_chips WHERE chips_id = :id", nativeQuery = true)
    void deleteChipsById(@Param("id") Long id);
}
