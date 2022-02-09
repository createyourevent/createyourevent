package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.ChipsCollectionChips;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ChipsCollectionChips entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChipsCollectionChipsExtRepository extends JpaRepository<ChipsCollectionChips, Long> {

    List<ChipsCollectionChips> findAllByChipsCollectionId(Long chipsCollectionId);

    ChipsCollectionChips findOneByChipsCollectionIdAndChipsId(Long chipsCollectionId, Long chipsId);

}
