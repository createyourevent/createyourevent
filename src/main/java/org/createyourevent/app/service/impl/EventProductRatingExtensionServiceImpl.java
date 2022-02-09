package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.EventProductRatingExtensionService;

import java.util.List;

import org.createyourevent.app.domain.EventProductRating;
import org.createyourevent.app.repository.EventProductRatingExtensionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing {@link EventProductRating}.
 */
@Service
@Transactional
public class EventProductRatingExtensionServiceImpl implements EventProductRatingExtensionService {

    private final Logger log = LoggerFactory.getLogger(EventProductRatingServiceImpl.class);

    private final EventProductRatingExtensionRepository eventProductRatingExtensionRepository;

    public EventProductRatingExtensionServiceImpl(EventProductRatingExtensionRepository eventProductRatingExtensionRepository) {
        this.eventProductRatingExtensionRepository = eventProductRatingExtensionRepository;
    }


    @Override
    public EventProductRating findByEventIdAndProductIdAndUserId(Long eventId, Long productId, String userId) {
        log.info("findByEventIdAndProductIdAndUserId()");
        return eventProductRatingExtensionRepository.findByEventIdAndProductIdAndUserId(eventId, productId, userId);
    }

    @Override
    public List<EventProductRating> findAllByEventIdAndProductId(Long eventId, Long productId) {
        log.info("findByEventIdAndProductIdAndUserId()");
        return eventProductRatingExtensionRepository.findAllByEventIdAndProductId(eventId, productId);
    }
}
