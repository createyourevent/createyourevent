package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ChipsCollection;
import org.createyourevent.app.repository.ChipsCollectionRepository;
import org.createyourevent.app.service.ChipsCollectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ChipsCollection}.
 */
@Service
@Transactional
public class ChipsCollectionServiceImpl implements ChipsCollectionService {

    private final Logger log = LoggerFactory.getLogger(ChipsCollectionServiceImpl.class);

    private final ChipsCollectionRepository chipsCollectionRepository;

    public ChipsCollectionServiceImpl(ChipsCollectionRepository chipsCollectionRepository) {
        this.chipsCollectionRepository = chipsCollectionRepository;
    }

    @Override
    public ChipsCollection save(ChipsCollection chipsCollection) {
        log.debug("Request to save ChipsCollection : {}", chipsCollection);
        return chipsCollectionRepository.save(chipsCollection);
    }

    @Override
    public Optional<ChipsCollection> partialUpdate(ChipsCollection chipsCollection) {
        log.debug("Request to partially update ChipsCollection : {}", chipsCollection);

        return chipsCollectionRepository
            .findById(chipsCollection.getId())
            .map(existingChipsCollection -> {
                return existingChipsCollection;
            })
            .map(chipsCollectionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChipsCollection> findAll(Pageable pageable) {
        log.debug("Request to get all ChipsCollections");
        return chipsCollectionRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ChipsCollection> findOne(Long id) {
        log.debug("Request to get ChipsCollection : {}", id);
        return chipsCollectionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ChipsCollection : {}", id);
        chipsCollectionRepository.deleteById(id);
    }
}
