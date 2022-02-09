package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.GiftExtService;
import org.createyourevent.app.domain.Gift;
import org.createyourevent.app.repository.GiftExtRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Gift}.
 */
@Service
@Transactional
public class GiftExtServiceImpl implements GiftExtService {

    private final Logger log = LoggerFactory.getLogger(GiftExtServiceImpl.class);

    private final GiftExtRepository giftExtRepository;

    public GiftExtServiceImpl(GiftExtRepository giftExtRepository) {
        this.giftExtRepository = giftExtRepository;
    }

    @Override
    public List<Gift> findByActiveTrue() {
        log.debug("findGiftByActiveTrue");
        return giftExtRepository.findByActiveTrue();
    }


}
