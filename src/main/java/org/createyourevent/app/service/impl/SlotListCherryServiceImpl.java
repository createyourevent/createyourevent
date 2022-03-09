package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListCherry;
import org.createyourevent.app.repository.SlotListCherryRepository;
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
public class SlotListCherryServiceImpl implements SlotListCherryService {

    private final Logger log = LoggerFactory.getLogger(SlotListCherryServiceImpl.class);

    private final SlotListCherryRepository slotListCherryRepository;

    public SlotListCherryServiceImpl(SlotListCherryRepository slotListCherryRepository) {
        this.slotListCherryRepository = slotListCherryRepository;
    }

    @Override
    public SlotListCherry save(SlotListCherry slotListCherry) {
        log.debug("Request to save SlotListCherry : {}", slotListCherry);
        return slotListCherryRepository.save(slotListCherry);
    }

    @Override
    public Optional<SlotListCherry> partialUpdate(SlotListCherry slotListCherry) {
        log.debug("Request to partially update SlotListCherry : {}", slotListCherry);

        return slotListCherryRepository
            .findById(slotListCherry.getId())
            .map(existingSlotListCherry -> {
                if (slotListCherry.getCoupons() != null) {
                    existingSlotListCherry.setCoupons(slotListCherry.getCoupons());
                }

                return existingSlotListCherry;
            })
            .map(slotListCherryRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SlotListCherry> findAll(Pageable pageable) {
        log.debug("Request to get all SlotListCherries");
        return slotListCherryRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SlotListCherry> findOne(Long id) {
        log.debug("Request to get SlotListCherry : {}", id);
        return slotListCherryRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete SlotListCherry : {}", id);
        slotListCherryRepository.deleteById(id);
    }
}
