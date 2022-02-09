package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ChipsExtService;
import org.createyourevent.app.service.ChipsService;
import org.createyourevent.app.domain.Chips;
import org.createyourevent.app.repository.ChipsExtRepository;
import org.createyourevent.app.repository.ChipsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Chips}.
 */
@Service
@Transactional
public class ChipsExtServiceImpl implements ChipsExtService {

    private final Logger log = LoggerFactory.getLogger(ChipsExtServiceImpl.class);

    private final ChipsExtRepository chipsExtRepository;

    public ChipsExtServiceImpl(ChipsExtRepository chipsExtRepository) {
        this.chipsExtRepository = chipsExtRepository;
    }

    @Override
    public void deleteChipsById(Long id) {
        chipsExtRepository.deleteChipsById(id);
    }
}
