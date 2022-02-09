package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.EventCommentExtensionService;
import org.createyourevent.app.domain.EventComment;
import org.createyourevent.app.repository.EventCommentExtensionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service Implementation for managing {@link EventComment}.
 */
@Service
@Transactional
public class EventCommentExtensionServiceImpl implements EventCommentExtensionService {

    private final Logger log = LoggerFactory.getLogger(EventCommentServiceImpl.class);

    private final EventCommentExtensionRepository eventCommentExtensionRepository;

    public EventCommentExtensionServiceImpl(EventCommentExtensionRepository eventCommentExtensionRepository) {
        this.eventCommentExtensionRepository = eventCommentExtensionRepository;
    }

    @Override
    public List<EventComment> findAllByEventId(Long eventId) {
        List<EventComment> eventComments = this.eventCommentExtensionRepository.findAllByEventId(eventId);
        List<EventComment> eventCommentsParent = new ArrayList<EventComment>();

        for(EventComment eventComment : eventComments) {
            if(eventComment.getEventComment() != null && eventComment.getEventComment().getId() == eventComment.getId()) {
                eventComment.getEventComments().add(eventComment.getEventComment());
            }
        }
        for(EventComment shopComment : eventComments) {
            if(shopComment.getEventComment() == null ) {
                eventCommentsParent.add(shopComment);
            }
        }
        return eventCommentsParent;
    }

    @Override
    public List<EventComment> findAllByEventIdAndUserId(Long eventId, String userId) {
        return eventCommentExtensionRepository.findAllByEventIdAndUserId(eventId, userId);
    }


}
