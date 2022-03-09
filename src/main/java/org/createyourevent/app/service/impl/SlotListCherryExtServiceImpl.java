package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListCherry;
import org.createyourevent.app.repository.SlotListCherryExtRepository;
import org.createyourevent.app.repository.SlotListCherryRepository;
import org.createyourevent.app.service.SlotListCherryExtService;
import org.createyourevent.app.service.SlotListCherryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SlotListCherry}.
 */
@Service
@Transactional
public class SlotListCherryExtServiceImpl implements SlotListCherryExtService {

    private final Logger log = LoggerFactory.getLogger(SlotListCherryServiceImpl.class);

    private final SlotListCherryExtRepository slotListCherryExtRepository;

    public SlotListCherryExtServiceImpl(SlotListCherryExtRepository slotListCherryExtRepository) {
        this.slotListCherryExtRepository = slotListCherryExtRepository;
    }

    @Override
    public void deleteAll() {
        this.slotListCherryExtRepository.deleteAll();
    }
}
