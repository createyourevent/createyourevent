package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.EventProductRating;
import org.createyourevent.app.repository.EventProductRatingRepository;
import org.createyourevent.app.service.EventProductRatingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventProductRating}.
 */
@Service
@Transactional
public class EventProductRatingServiceImpl implements EventProductRatingService {

    private final Logger log = LoggerFactory.getLogger(EventProductRatingServiceImpl.class);

    private final EventProductRatingRepository eventProductRatingRepository;

    public EventProductRatingServiceImpl(EventProductRatingRepository eventProductRatingRepository) {
        this.eventProductRatingRepository = eventProductRatingRepository;
    }

    @Override
    public EventProductRating save(EventProductRating eventProductRating) {
        log.debug("Request to save EventProductRating : {}", eventProductRating);
        return eventProductRatingRepository.save(eventProductRating);
    }

    @Override
    public Optional<EventProductRating> partialUpdate(EventProductRating eventProductRating) {
        log.debug("Request to partially update EventProductRating : {}", eventProductRating);

        return eventProductRatingRepository
            .findById(eventProductRating.getId())
            .map(existingEventProductRating -> {
                if (eventProductRating.getLike() != null) {
                    existingEventProductRating.setLike(eventProductRating.getLike());
                }
                if (eventProductRating.getDislike() != null) {
                    existingEventProductRating.setDislike(eventProductRating.getDislike());
                }
                if (eventProductRating.getDate() != null) {
                    existingEventProductRating.setDate(eventProductRating.getDate());
                }
                if (eventProductRating.getComment() != null) {
                    existingEventProductRating.setComment(eventProductRating.getComment());
                }

                return existingEventProductRating;
            })
            .map(eventProductRatingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventProductRating> findAll(Pageable pageable) {
        log.debug("Request to get all EventProductRatings");
        return eventProductRatingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventProductRating> findOne(Long id) {
        log.debug("Request to get EventProductRating : {}", id);
        return eventProductRatingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventProductRating : {}", id);
        eventProductRatingRepository.deleteById(id);
    }
}
