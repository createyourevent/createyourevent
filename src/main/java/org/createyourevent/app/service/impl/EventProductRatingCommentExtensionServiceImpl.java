package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.EventProductRatingCommentExtensionService;
import org.createyourevent.app.service.EventProductRatingCommentService;
import org.createyourevent.app.domain.EventProductRatingComment;
import org.createyourevent.app.repository.EventProductRatingCommentExtensionRepository;
import org.createyourevent.app.repository.EventProductRatingCommentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link EventProductRatingComment}.
 */
@Service
@Transactional
public class EventProductRatingCommentExtensionServiceImpl implements EventProductRatingCommentExtensionService {

    private final Logger log = LoggerFactory.getLogger(EventProductRatingCommentServiceImpl.class);

    private final EventProductRatingCommentExtensionRepository eventProductRatingCommentExtensionRepository;

    public EventProductRatingCommentExtensionServiceImpl(
            EventProductRatingCommentExtensionRepository eventProductRatingCommentExtensionRepository) {
        this.eventProductRatingCommentExtensionRepository = eventProductRatingCommentExtensionRepository;
    }

    @Override
    public List<EventProductRatingComment> findAllByEventIdAndProductId(Long eventId, Long productId) {
        log.debug("Request to get EventProductRatingComment by EventId and ProductId.");
        return eventProductRatingCommentExtensionRepository.findAllByEventIdAndProductId(eventId, productId);
    }
}
