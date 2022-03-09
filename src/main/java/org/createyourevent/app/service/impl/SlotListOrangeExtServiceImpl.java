package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListOrange;
import org.createyourevent.app.repository.SlotListOrangeExtRepository;
import org.createyourevent.app.service.SlotListOrangeExtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SlotListOrange}.
 */
@Service
@Transactional
public class SlotListOrangeExtServiceImpl implements SlotListOrangeExtService {

    private final Logger log = LoggerFactory.getLogger(SlotListOrangeExtServiceImpl.class);

    private final SlotListOrangeExtRepository slotListOrangeExtRepository;

    public SlotListOrangeExtServiceImpl(SlotListOrangeExtRepository slotListOrangeExtRepository) {
        this.slotListOrangeExtRepository = slotListOrangeExtRepository;
    }

    @Override
    public void deleteAll() {
        this.slotListOrangeExtRepository.deleteAll();
    }
}
