package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ChipsCollectionChips;
import org.createyourevent.app.repository.ChipsCollectionChipsRepository;
import org.createyourevent.app.service.ChipsCollectionChipsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ChipsCollectionChips}.
 */
@Service
@Transactional
public class ChipsCollectionChipsServiceImpl implements ChipsCollectionChipsService {

    private final Logger log = LoggerFactory.getLogger(ChipsCollectionChipsServiceImpl.class);

    private final ChipsCollectionChipsRepository chipsCollectionChipsRepository;

    public ChipsCollectionChipsServiceImpl(ChipsCollectionChipsRepository chipsCollectionChipsRepository) {
        this.chipsCollectionChipsRepository = chipsCollectionChipsRepository;
    }

    @Override
    public ChipsCollectionChips save(ChipsCollectionChips chipsCollectionChips) {
        log.debug("Request to save ChipsCollectionChips : {}", chipsCollectionChips);
        return chipsCollectionChipsRepository.save(chipsCollectionChips);
    }

    @Override
    public Optional<ChipsCollectionChips> partialUpdate(ChipsCollectionChips chipsCollectionChips) {
        log.debug("Request to partially update ChipsCollectionChips : {}", chipsCollectionChips);

        return chipsCollectionChipsRepository
            .findById(chipsCollectionChips.getId())
            .map(existingChipsCollectionChips -> {
                return existingChipsCollectionChips;
            })
            .map(chipsCollectionChipsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChipsCollectionChips> findAll(Pageable pageable) {
        log.debug("Request to get all ChipsCollectionChips");
        return chipsCollectionChipsRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ChipsCollectionChips> findOne(Long id) {
        log.debug("Request to get ChipsCollectionChips : {}", id);
        return chipsCollectionChipsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ChipsCollectionChips : {}", id);
        chipsCollectionChipsRepository.deleteById(id);
    }
}
