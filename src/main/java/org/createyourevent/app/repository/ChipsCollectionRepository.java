package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ChipsCollection;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChipsCollection entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChipsCollectionRepository extends JpaRepository<ChipsCollection, Long> {}
