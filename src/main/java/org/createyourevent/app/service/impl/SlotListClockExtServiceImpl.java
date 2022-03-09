package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListClock;
import org.createyourevent.app.repository.SlotListClockExtRepository;
import org.createyourevent.app.service.SlotListClockExtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SlotListClock}.
 */
@Service
@Transactional
public class SlotListClockExtServiceImpl implements SlotListClockExtService {

    private final Logger log = LoggerFactory.getLogger(SlotListClockExtServiceImpl.class);

    private final SlotListClockExtRepository slotListClockExtRepository;

    public SlotListClockExtServiceImpl(SlotListClockExtRepository slotListClockExtRepository) {
        this.slotListClockExtRepository = slotListClockExtRepository;
    }

    @Override
    public void deleteAll() {
        this.slotListClockExtRepository.deleteAll();
    }
}
