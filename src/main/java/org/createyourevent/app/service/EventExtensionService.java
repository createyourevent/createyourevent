package org.createyourevent.app.service;

import java.time.ZonedDateTime;
import java.util.List;

import org.createyourevent.app.domain.Event;

public interface EventExtensionService {

    List<Event> findByUserIdAndActiveTrue(String userId);

    List<Event> findByPrivateOrPublicAndActiveTrue();

    List<Event> findByPrivateOrPublicAndActiveTrueAndDateEndAfter(ZonedDateTime now);

    List<Event> findByPrivateOrPublicAndActiveTrueAndDateStartBetween(ZonedDateTime betweenStart, ZonedDateTime betweenEnd);

    List<Event> findAll();

    List<Event> findByPrivateOrPublicAndActiveTrueAndDateEndBefor(ZonedDateTime now);

    List<Event> findByUserIdAndActiveTrueAndPrivateOrPublic();

    List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBefor(ZonedDateTime now);

    List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBeforAndUserId(ZonedDateTime now, String userId);

    List<Event> findAllByActiveTrueAndDateEndBeforAndUserId(ZonedDateTime now, String userId);

    List<Event> findAllByActiveTrueAndDateEndAfterAndUserId(ZonedDateTime now, String userId);

    List<Event> findAllByActiveTrueAndBilledTrueAndDateEndBeforAndUserId(ZonedDateTime now, String userId);

    Event findByEventId(Long id);
}
