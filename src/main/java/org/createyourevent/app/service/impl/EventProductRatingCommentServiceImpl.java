package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.EventProductRatingComment;
import org.createyourevent.app.repository.EventProductRatingCommentRepository;
import org.createyourevent.app.service.EventProductRatingCommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventProductRatingComment}.
 */
@Service
@Transactional
public class EventProductRatingCommentServiceImpl implements EventProductRatingCommentService {

    private final Logger log = LoggerFactory.getLogger(EventProductRatingCommentServiceImpl.class);

    private final EventProductRatingCommentRepository eventProductRatingCommentRepository;

    public EventProductRatingCommentServiceImpl(EventProductRatingCommentRepository eventProductRatingCommentRepository) {
        this.eventProductRatingCommentRepository = eventProductRatingCommentRepository;
    }

    @Override
    public EventProductRatingComment save(EventProductRatingComment eventProductRatingComment) {
        log.debug("Request to save EventProductRatingComment : {}", eventProductRatingComment);
        return eventProductRatingCommentRepository.save(eventProductRatingComment);
    }

    @Override
    public Optional<EventProductRatingComment> partialUpdate(EventProductRatingComment eventProductRatingComment) {
        log.debug("Request to partially update EventProductRatingComment : {}", eventProductRatingComment);

        return eventProductRatingCommentRepository
            .findById(eventProductRatingComment.getId())
            .map(existingEventProductRatingComment -> {
                if (eventProductRatingComment.getComment() != null) {
                    existingEventProductRatingComment.setComment(eventProductRatingComment.getComment());
                }
                if (eventProductRatingComment.getDate() != null) {
                    existingEventProductRatingComment.setDate(eventProductRatingComment.getDate());
                }

                return existingEventProductRatingComment;
            })
            .map(eventProductRatingCommentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventProductRatingComment> findAll(Pageable pageable) {
        log.debug("Request to get all EventProductRatingComments");
        return eventProductRatingCommentRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventProductRatingComment> findOne(Long id) {
        log.debug("Request to get EventProductRatingComment : {}", id);
        return eventProductRatingCommentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventProductRatingComment : {}", id);
        eventProductRatingCommentRepository.deleteById(id);
    }
}
