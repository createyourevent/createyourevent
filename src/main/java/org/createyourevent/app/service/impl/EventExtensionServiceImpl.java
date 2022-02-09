package org.createyourevent.app.service.impl;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.createyourevent.app.domain.Event;
import org.createyourevent.app.repository.EventExtensionRepository;
import org.createyourevent.app.service.EventExtensionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class EventExtensionServiceImpl implements EventExtensionService {

    private final Logger log = LoggerFactory.getLogger(EventExtensionServiceImpl.class);

    private final EventExtensionRepository eventExtensionRepository;

    public EventExtensionServiceImpl(EventExtensionRepository eventExtensionRepository) {
        this.eventExtensionRepository = eventExtensionRepository;
    }

    @Override
    public List<Event> findByUserIdAndActiveTrue(String userId) {
        log.debug("Request to get all Shops from a user with active=true");
        List<Event> r = eventExtensionRepository.findByUserIdAndActiveTrue(userId);
        return r;
    }

    @Override
    public List<Event> findByPrivateOrPublicAndActiveTrue() {
        log.debug("Request to get all Shops from a user with active=true and event is public");
        return eventExtensionRepository.findByPrivateOrPublicAndActiveTrue();
    }

    @Override
    public List<Event> findAll() {
        log.debug("Request to get all Events");
        return eventExtensionRepository.findAll();
    }

    @Override
    public List<Event> findByPrivateOrPublicAndActiveTrueAndDateEndAfter(ZonedDateTime now) {
        return eventExtensionRepository.findAllByPrivateOrPublicAndActiveTrueAndDateEndAfter(now);
    }

    @Override
    public List<Event> findByPrivateOrPublicAndActiveTrueAndDateEndBefor(ZonedDateTime now) {
        return eventExtensionRepository.findByPrivateOrPublicAndActiveTrueAndDateEndBefor(now);
    }

    @Override
    public List<Event> findByPrivateOrPublicAndActiveTrueAndDateStartBetween(ZonedDateTime betweenStart,
            ZonedDateTime betweenEnd) {
        return eventExtensionRepository.findByPrivateOrPublicAndActiveTrueAndDateStartBetween(betweenStart, betweenEnd);
    }

    @Override
    public List<Event> findByUserIdAndActiveTrueAndPrivateOrPublic() {
        log.debug("Request to get all Shops from a user with active=true and event is public");
        return eventExtensionRepository.findByUserIdAndActiveTrueAndPrivateOrPublic();
    }

    @Override
    public List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBefor(ZonedDateTime now) {
        log.debug("Request to get all Events with active=true ");
        List<Event> e = eventExtensionRepository.findAllByActiveTrueAndBilledFalseAndDateEndBefor(now);
        return e;
    }

    @Override
    public List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBeforAndUserId(ZonedDateTime now, String userId) {
        log.debug("List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBeforAndUserId(ZonedDateTime now, String userId)");
        List<Event> l = eventExtensionRepository.findAllByActiveTrueAndBilledFalseAndDateEndBeforAndUserId(now, userId);
        return l;
    }

    @Override
    public List<Event> findAllByActiveTrueAndBilledTrueAndDateEndBeforAndUserId(ZonedDateTime now, String userId) {
        log.debug("List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBeforAndUserId(ZonedDateTime now, String userId)");
        return eventExtensionRepository.findAllByActiveTrueAndBilledTrueAndDateEndBeforAndUserId(now, userId);
    }

    @Override
    public Event findByEventId(Long id) {
        Event e = eventExtensionRepository.findByEventId(id);
        return e;
    }

    @Override
    public List<Event> findAllByActiveTrueAndDateEndBeforAndUserId(ZonedDateTime now, String userId) {
        return eventExtensionRepository.findAllByActiveTrueAndDateEndBeforAndUserId(now, userId);
    }

    @Override
    public List<Event> findAllByActiveTrueAndDateEndAfterAndUserId(ZonedDateTime now, String userId) {
        return eventExtensionRepository.findAllByActiveTrueAndDateEndAfterAndUserId(now, userId);
    }
}
