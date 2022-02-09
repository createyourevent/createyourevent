package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Chips;
import org.createyourevent.app.repository.ChipsRepository;
import org.createyourevent.app.service.ChipsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Chips}.
 */
@Service
@Transactional
public class ChipsServiceImpl implements ChipsService {

    private final Logger log = LoggerFactory.getLogger(ChipsServiceImpl.class);

    private final ChipsRepository chipsRepository;

    public ChipsServiceImpl(ChipsRepository chipsRepository) {
        this.chipsRepository = chipsRepository;
    }

    @Override
    public Chips save(Chips chips) {
        log.debug("Request to save Chips : {}", chips);
        return chipsRepository.save(chips);
    }

    @Override
    public Optional<Chips> partialUpdate(Chips chips) {
        log.debug("Request to partially update Chips : {}", chips);

        return chipsRepository
            .findById(chips.getId())
            .map(existingChips -> {
                if (chips.getPoints() != null) {
                    existingChips.setPoints(chips.getPoints());
                }
                if (chips.getWebsite() != null) {
                    existingChips.setWebsite(chips.getWebsite());
                }
                if (chips.getX() != null) {
                    existingChips.setX(chips.getX());
                }
                if (chips.getY() != null) {
                    existingChips.setY(chips.getY());
                }
                if (chips.getImage() != null) {
                    existingChips.setImage(chips.getImage());
                }
                if (chips.getImageContentType() != null) {
                    existingChips.setImageContentType(chips.getImageContentType());
                }
                if (chips.getColor() != null) {
                    existingChips.setColor(chips.getColor());
                }

                return existingChips;
            })
            .map(chipsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Chips> findAll(Pageable pageable) {
        log.debug("Request to get all Chips");
        return chipsRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Chips> findOne(Long id) {
        log.debug("Request to get Chips : {}", id);
        return chipsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Chips : {}", id);
        chipsRepository.deleteById(id);
    }
}
