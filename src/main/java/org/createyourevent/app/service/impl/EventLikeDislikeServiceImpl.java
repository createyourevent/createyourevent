package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.EventLikeDislike;
import org.createyourevent.app.repository.EventLikeDislikeRepository;
import org.createyourevent.app.service.EventLikeDislikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventLikeDislike}.
 */
@Service
@Transactional
public class EventLikeDislikeServiceImpl implements EventLikeDislikeService {

    private final Logger log = LoggerFactory.getLogger(EventLikeDislikeServiceImpl.class);

    private final EventLikeDislikeRepository eventLikeDislikeRepository;

    public EventLikeDislikeServiceImpl(EventLikeDislikeRepository eventLikeDislikeRepository) {
        this.eventLikeDislikeRepository = eventLikeDislikeRepository;
    }

    @Override
    public EventLikeDislike save(EventLikeDislike eventLikeDislike) {
        log.debug("Request to save EventLikeDislike : {}", eventLikeDislike);
        return eventLikeDislikeRepository.save(eventLikeDislike);
    }

    @Override
    public Optional<EventLikeDislike> partialUpdate(EventLikeDislike eventLikeDislike) {
        log.debug("Request to partially update EventLikeDislike : {}", eventLikeDislike);

        return eventLikeDislikeRepository
            .findById(eventLikeDislike.getId())
            .map(existingEventLikeDislike -> {
                if (eventLikeDislike.getLike() != null) {
                    existingEventLikeDislike.setLike(eventLikeDislike.getLike());
                }
                if (eventLikeDislike.getDislike() != null) {
                    existingEventLikeDislike.setDislike(eventLikeDislike.getDislike());
                }
                if (eventLikeDislike.getDate() != null) {
                    existingEventLikeDislike.setDate(eventLikeDislike.getDate());
                }
                if (eventLikeDislike.getComment() != null) {
                    existingEventLikeDislike.setComment(eventLikeDislike.getComment());
                }

                return existingEventLikeDislike;
            })
            .map(eventLikeDislikeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventLikeDislike> findAll(Pageable pageable) {
        log.debug("Request to get all EventLikeDislikes");
        return eventLikeDislikeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventLikeDislike> findOne(Long id) {
        log.debug("Request to get EventLikeDislike : {}", id);
        return eventLikeDislikeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventLikeDislike : {}", id);
        eventLikeDislikeRepository.deleteById(id);
    }
}
