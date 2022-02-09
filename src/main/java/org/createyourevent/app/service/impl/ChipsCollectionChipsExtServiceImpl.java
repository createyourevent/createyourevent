package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ChipsCollectionChipsExtService;
import org.createyourevent.app.service.ChipsCollectionChipsService;
import org.createyourevent.app.domain.ChipsCollectionChips;
import org.createyourevent.app.repository.ChipsCollectionChipsExtRepository;
import org.createyourevent.app.repository.ChipsCollectionChipsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ChipsCollectionChips}.
 */
@Service
@Transactional
public class ChipsCollectionChipsExtServiceImpl implements ChipsCollectionChipsExtService {

    private final Logger log = LoggerFactory.getLogger(ChipsCollectionChipsServiceImpl.class);

    private final ChipsCollectionChipsExtRepository chipsCollectionChipsExtRepository;

    public ChipsCollectionChipsExtServiceImpl(ChipsCollectionChipsExtRepository chipsCollectionChipsExtRepository) {
        this.chipsCollectionChipsExtRepository = chipsCollectionChipsExtRepository;
    }

    @Override
    public List<ChipsCollectionChips> findAllByChipsCollectionId(Long chipsCollectionId) {
        log.debug("findAllByChipsCollectionId(Long chipsCollectionId)");
        return chipsCollectionChipsExtRepository.findAllByChipsCollectionId(chipsCollectionId);
    }

    @Override
    public void deleteAllChipsCollectionChips() {
        log.debug("deleteAllChipsCollectionChips()");
        chipsCollectionChipsExtRepository.deleteAll();

    }

    @Override
    public ChipsCollectionChips findOneByChipsCollectionIdAndChipsId(Long chipsCollectionId, Long chipsId) {
        log.debug("ChipsCollectionChips findOneByChipsCollectionIdAndChipsId(Long chipsCollectionId, Long chipsId)");
        return chipsCollectionChipsExtRepository.findOneByChipsCollectionIdAndChipsId(chipsCollectionId, chipsId);
    }


}
