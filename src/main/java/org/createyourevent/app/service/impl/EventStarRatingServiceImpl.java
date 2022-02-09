package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.EventStarRating;
import org.createyourevent.app.repository.EventStarRatingRepository;
import org.createyourevent.app.service.EventStarRatingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventStarRating}.
 */
@Service
@Transactional
public class EventStarRatingServiceImpl implements EventStarRatingService {

    private final Logger log = LoggerFactory.getLogger(EventStarRatingServiceImpl.class);

    private final EventStarRatingRepository eventStarRatingRepository;

    public EventStarRatingServiceImpl(EventStarRatingRepository eventStarRatingRepository) {
        this.eventStarRatingRepository = eventStarRatingRepository;
    }

    @Override
    public EventStarRating save(EventStarRating eventStarRating) {
        log.debug("Request to save EventStarRating : {}", eventStarRating);
        return eventStarRatingRepository.save(eventStarRating);
    }

    @Override
    public Optional<EventStarRating> partialUpdate(EventStarRating eventStarRating) {
        log.debug("Request to partially update EventStarRating : {}", eventStarRating);

        return eventStarRatingRepository
            .findById(eventStarRating.getId())
            .map(existingEventStarRating -> {
                if (eventStarRating.getStars() != null) {
                    existingEventStarRating.setStars(eventStarRating.getStars());
                }
                if (eventStarRating.getDate() != null) {
                    existingEventStarRating.setDate(eventStarRating.getDate());
                }
                if (eventStarRating.getComment() != null) {
                    existingEventStarRating.setComment(eventStarRating.getComment());
                }

                return existingEventStarRating;
            })
            .map(eventStarRatingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventStarRating> findAll(Pageable pageable) {
        log.debug("Request to get all EventStarRatings");
        return eventStarRatingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventStarRating> findOne(Long id) {
        log.debug("Request to get EventStarRating : {}", id);
        return eventStarRatingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventStarRating : {}", id);
        eventStarRatingRepository.deleteById(id);
    }
}
