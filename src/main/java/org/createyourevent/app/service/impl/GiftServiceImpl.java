package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Gift;
import org.createyourevent.app.repository.GiftRepository;
import org.createyourevent.app.service.GiftService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Gift}.
 */
@Service
@Transactional
public class GiftServiceImpl implements GiftService {

    private final Logger log = LoggerFactory.getLogger(GiftServiceImpl.class);

    private final GiftRepository giftRepository;

    public GiftServiceImpl(GiftRepository giftRepository) {
        this.giftRepository = giftRepository;
    }

    @Override
    public Gift save(Gift gift) {
        log.debug("Request to save Gift : {}", gift);
        return giftRepository.save(gift);
    }

    @Override
    public Optional<Gift> partialUpdate(Gift gift) {
        log.debug("Request to partially update Gift : {}", gift);

        return giftRepository
            .findById(gift.getId())
            .map(existingGift -> {
                if (gift.getTitle() != null) {
                    existingGift.setTitle(gift.getTitle());
                }
                if (gift.getDescription() != null) {
                    existingGift.setDescription(gift.getDescription());
                }
                if (gift.getPhoto() != null) {
                    existingGift.setPhoto(gift.getPhoto());
                }
                if (gift.getPhotoContentType() != null) {
                    existingGift.setPhotoContentType(gift.getPhotoContentType());
                }
                if (gift.getPoints() != null) {
                    existingGift.setPoints(gift.getPoints());
                }
                if (gift.getActive() != null) {
                    existingGift.setActive(gift.getActive());
                }
                if (gift.getStock() != null) {
                    existingGift.setStock(gift.getStock());
                }

                return existingGift;
            })
            .map(giftRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Gift> findAll(Pageable pageable) {
        log.debug("Request to get all Gifts");
        return giftRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Gift> findOne(Long id) {
        log.debug("Request to get Gift : {}", id);
        return giftRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Gift : {}", id);
        giftRepository.deleteById(id);
    }
}
