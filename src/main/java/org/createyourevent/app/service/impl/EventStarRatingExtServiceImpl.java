package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.EventStarRatingExtService;
import org.createyourevent.app.service.EventStarRatingService;
import org.createyourevent.app.domain.EventStarRating;
import org.createyourevent.app.repository.EventStarRatingExtRepository;
import org.createyourevent.app.repository.EventStarRatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link EventStarRating}.
 */
@Service
@Transactional
public class EventStarRatingExtServiceImpl implements EventStarRatingExtService {

    private final Logger log = LoggerFactory.getLogger(EventStarRatingServiceImpl.class);

    private final EventStarRatingExtRepository eventStarRatingExtRepository;

    public EventStarRatingExtServiceImpl(EventStarRatingExtRepository eventStarRatingExtRepository) {
        this.eventStarRatingExtRepository = eventStarRatingExtRepository;
    }

    @Override
    public List<EventStarRating> findAllEventStarRatingByEventIdAndUserId(Long eventId, String userId) {
        List<EventStarRating> s = this.eventStarRatingExtRepository.findAllByEventIdAndUserId(eventId, userId);
        return s;
    }

    @Override
    public List<EventStarRating> findAllEventStarRatingByEventId(Long eventId) {
        List<EventStarRating> s = this.eventStarRatingExtRepository.findAllByEventId(eventId);
        return s;
    }

    @Override
    public List<EventStarRating> findAllEventStarRatingByUserId(String userId) {
        List<EventStarRating> s = this.eventStarRatingExtRepository.findAllByUserId(userId);
        return s;
    }

    @Override
    public List<EventStarRating> findAllWhereStarsBiggerAs(Integer stars) {
        List<EventStarRating> s = this.eventStarRatingExtRepository.findAllWhereStarsBiggerAs(stars);
        return s;
    }

}
