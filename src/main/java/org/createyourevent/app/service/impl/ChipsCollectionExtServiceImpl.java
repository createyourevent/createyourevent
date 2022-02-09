package org.createyourevent.app.service.impl;

import org.createyourevent.app.repository.ChipsCollectionExtRepository;

import org.createyourevent.app.service.ChipsCollectionExtService;
import org.createyourevent.app.service.ChipsCollectionService;
import org.createyourevent.app.domain.ChipsCollection;
import org.createyourevent.app.repository.ChipsCollectionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ChipsCollection}.
 */
@Service
@Transactional
public class ChipsCollectionExtServiceImpl implements ChipsCollectionExtService {

    private final Logger log = LoggerFactory.getLogger(ChipsCollectionServiceImpl.class);

    private final ChipsCollectionExtRepository chipsCollectionExtRepository;

    public ChipsCollectionExtServiceImpl(ChipsCollectionExtRepository chipsCollectionExtRepository) {
        this.chipsCollectionExtRepository = chipsCollectionExtRepository;
    }

    @Override
    public ChipsCollection findChipsCollectionByUserId(String userId) {
        log.debug("findChipsCollectionByUserId(String userId)");
        return chipsCollectionExtRepository.findByUserId(userId);
    }
}
