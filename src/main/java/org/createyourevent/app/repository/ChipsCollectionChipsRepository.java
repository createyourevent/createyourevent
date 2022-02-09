package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ChipsCollectionChips;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChipsCollectionChips entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChipsCollectionChipsRepository extends JpaRepository<ChipsCollectionChips, Long> {}
