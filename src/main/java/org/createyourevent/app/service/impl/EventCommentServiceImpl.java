package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.EventComment;
import org.createyourevent.app.repository.EventCommentRepository;
import org.createyourevent.app.service.EventCommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventComment}.
 */
@Service
@Transactional
public class EventCommentServiceImpl implements EventCommentService {

    private final Logger log = LoggerFactory.getLogger(EventCommentServiceImpl.class);

    private final EventCommentRepository eventCommentRepository;

    public EventCommentServiceImpl(EventCommentRepository eventCommentRepository) {
        this.eventCommentRepository = eventCommentRepository;
    }

    @Override
    public EventComment save(EventComment eventComment) {
        log.debug("Request to save EventComment : {}", eventComment);
        return eventCommentRepository.save(eventComment);
    }

    @Override
    public Optional<EventComment> partialUpdate(EventComment eventComment) {
        log.debug("Request to partially update EventComment : {}", eventComment);

        return eventCommentRepository
            .findById(eventComment.getId())
            .map(existingEventComment -> {
                if (eventComment.getComment() != null) {
                    existingEventComment.setComment(eventComment.getComment());
                }
                if (eventComment.getDate() != null) {
                    existingEventComment.setDate(eventComment.getDate());
                }

                return existingEventComment;
            })
            .map(eventCommentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventComment> findAll(Pageable pageable) {
        log.debug("Request to get all EventComments");
        return eventCommentRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventComment> findOne(Long id) {
        log.debug("Request to get EventComment : {}", id);
        return eventCommentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventComment : {}", id);
        eventCommentRepository.deleteById(id);
    }
}
