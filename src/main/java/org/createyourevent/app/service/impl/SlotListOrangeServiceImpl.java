package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListOrange;
import org.createyourevent.app.repository.SlotListOrangeRepository;
import org.createyourevent.app.service.SlotListOrangeService;
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
public class SlotListOrangeServiceImpl implements SlotListOrangeService {

    private final Logger log = LoggerFactory.getLogger(SlotListOrangeServiceImpl.class);

    private final SlotListOrangeRepository slotListOrangeRepository;

    public SlotListOrangeServiceImpl(SlotListOrangeRepository slotListOrangeRepository) {
        this.slotListOrangeRepository = slotListOrangeRepository;
    }

    @Override
    public SlotListOrange save(SlotListOrange slotListOrange) {
        log.debug("Request to save SlotListOrange : {}", slotListOrange);
        return slotListOrangeRepository.save(slotListOrange);
    }

    @Override
    public Optional<SlotListOrange> partialUpdate(SlotListOrange slotListOrange) {
        log.debug("Request to partially update SlotListOrange : {}", slotListOrange);

        return slotListOrangeRepository
            .findById(slotListOrange.getId())
            .map(existingSlotListOrange -> {
                if (slotListOrange.getCoupons() != null) {
                    existingSlotListOrange.setCoupons(slotListOrange.getCoupons());
                }

                return existingSlotListOrange;
            })
            .map(slotListOrangeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SlotListOrange> findAll(Pageable pageable) {
        log.debug("Request to get all SlotListOranges");
        return slotListOrangeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SlotListOrange> findOne(Long id) {
        log.debug("Request to get SlotListOrange : {}", id);
        return slotListOrangeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete SlotListOrange : {}", id);
        slotListOrangeRepository.deleteById(id);
    }
}
