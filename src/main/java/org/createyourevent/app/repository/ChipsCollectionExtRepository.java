package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ChipsCollection;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ChipsCollection entity.
 */
@Repository
public interface ChipsCollectionExtRepository extends JpaRepository<ChipsCollection, Long> {
    ChipsCollection findByUserId(String userId);
}
