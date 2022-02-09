package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.EventLikeDislikeExtensionService;
import org.createyourevent.app.domain.EventLikeDislike;
import org.createyourevent.app.repository.EventLikeDislikeExtensionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing {@link EventLikeDislike}.
 */
@Service
@Transactional
public class EventLikeDislikeExtensionServiceImpl implements EventLikeDislikeExtensionService {

    private final Logger log = LoggerFactory.getLogger(EventLikeDislikeServiceImpl.class);

    private final EventLikeDislikeExtensionRepository eventLikeDislikeExtensionRepository;

    public EventLikeDislikeExtensionServiceImpl(EventLikeDislikeExtensionRepository eventLikeDislikeExtensionRepository) {
        this.eventLikeDislikeExtensionRepository = eventLikeDislikeExtensionRepository;
    }

    @Override
    public List<EventLikeDislike> findAllByEventId(Long eventId) {
        return eventLikeDislikeExtensionRepository.findAllByEventId(eventId);
    }

    @Override
    public List<EventLikeDislike> findAllByEventIdAndUserId(Long eventId, String userId) {
        return eventLikeDislikeExtensionRepository.findAllByEventIdAndUserId(eventId, userId);
    }
}
