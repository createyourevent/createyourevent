package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListPlum;
import org.createyourevent.app.repository.SlotListPlumExtRepository;
import org.createyourevent.app.service.SlotListPlumExtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SlotListPlum}.
 */
@Service
@Transactional
public class SlotListPlumExtServiceImpl implements SlotListPlumExtService {

    private final Logger log = LoggerFactory.getLogger(SlotListPlumExtServiceImpl.class);

    private final SlotListPlumExtRepository slotListPlumExtRepository;

    public SlotListPlumExtServiceImpl(SlotListPlumExtRepository slotListPlumExtRepository) {
        this.slotListPlumExtRepository = slotListPlumExtRepository;
    }

    @Override
    public void deleteAll() {
        this.slotListPlumExtRepository.deleteAll();
    }
}
