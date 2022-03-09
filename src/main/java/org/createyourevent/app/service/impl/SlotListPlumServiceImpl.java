package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListPlum;
import org.createyourevent.app.repository.SlotListPlumRepository;
import org.createyourevent.app.service.SlotListPlumService;
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
public class SlotListPlumServiceImpl implements SlotListPlumService {

    private final Logger log = LoggerFactory.getLogger(SlotListPlumServiceImpl.class);

    private final SlotListPlumRepository slotListPlumRepository;

    public SlotListPlumServiceImpl(SlotListPlumRepository slotListPlumRepository) {
        this.slotListPlumRepository = slotListPlumRepository;
    }

    @Override
    public SlotListPlum save(SlotListPlum slotListPlum) {
        log.debug("Request to save SlotListPlum : {}", slotListPlum);
        return slotListPlumRepository.save(slotListPlum);
    }

    @Override
    public Optional<SlotListPlum> partialUpdate(SlotListPlum slotListPlum) {
        log.debug("Request to partially update SlotListPlum : {}", slotListPlum);

        return slotListPlumRepository
            .findById(slotListPlum.getId())
            .map(existingSlotListPlum -> {
                if (slotListPlum.getCoupons() != null) {
                    existingSlotListPlum.setCoupons(slotListPlum.getCoupons());
                }

                return existingSlotListPlum;
            })
            .map(slotListPlumRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SlotListPlum> findAll(Pageable pageable) {
        log.debug("Request to get all SlotListPlums");
        return slotListPlumRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SlotListPlum> findOne(Long id) {
        log.debug("Request to get SlotListPlum : {}", id);
        return slotListPlumRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete SlotListPlum : {}", id);
        slotListPlumRepository.deleteById(id);
    }
}
