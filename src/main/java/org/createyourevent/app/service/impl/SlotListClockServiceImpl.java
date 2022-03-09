package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListClock;
import org.createyourevent.app.repository.SlotListClockRepository;
import org.createyourevent.app.service.SlotListClockService;
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
public class SlotListClockServiceImpl implements SlotListClockService {

    private final Logger log = LoggerFactory.getLogger(SlotListClockServiceImpl.class);

    private final SlotListClockRepository slotListClockRepository;

    public SlotListClockServiceImpl(SlotListClockRepository slotListClockRepository) {
        this.slotListClockRepository = slotListClockRepository;
    }

    @Override
    public SlotListClock save(SlotListClock slotListClock) {
        log.debug("Request to save SlotListClock : {}", slotListClock);
        return slotListClockRepository.save(slotListClock);
    }

    @Override
    public Optional<SlotListClock> partialUpdate(SlotListClock slotListClock) {
        log.debug("Request to partially update SlotListClock : {}", slotListClock);

        return slotListClockRepository
            .findById(slotListClock.getId())
            .map(existingSlotListClock -> {
                if (slotListClock.getCoupons() != null) {
                    existingSlotListClock.setCoupons(slotListClock.getCoupons());
                }

                return existingSlotListClock;
            })
            .map(slotListClockRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SlotListClock> findAll(Pageable pageable) {
        log.debug("Request to get all SlotListClocks");
        return slotListClockRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SlotListClock> findOne(Long id) {
        log.debug("Request to get SlotListClock : {}", id);
        return slotListClockRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete SlotListClock : {}", id);
        slotListClockRepository.deleteById(id);
    }
}
