package org.createyourevent.app.service;

import java.util.List;

import org.createyourevent.app.domain.ChipsCollectionChips;

/**
 * Service Interface for managing {@link ChipsCollectionChips}.
 */
public interface ChipsCollectionChipsExtService {
    List<ChipsCollectionChips> findAllByChipsCollectionId(Long chipsCollectionId);
    void deleteAllChipsCollectionChips();
    ChipsCollectionChips findOneByChipsCollectionIdAndChipsId(Long chipsCollectionId, Long chipsId);
}
