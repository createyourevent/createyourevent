package org.createyourevent.app.service;

import org.createyourevent.app.domain.EventServiceMapOrder;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Service Interface for managing {@link EventServiceMapOrder}.
 */
public interface EventServiceMapOrderExtService {

    List<EventServiceMapOrder> findByServiceMapId(Long serviceMapId);

    List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateRange(ZonedDateTime startTime, ZonedDateTime endTime);

    List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateRangeAndServiceMapId(Long serviceMapId, ZonedDateTime startTime, ZonedDateTime endTime);

    List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateFromRangeAndEventId( Long eventId, ZonedDateTime startTime, ZonedDateTime endTime);

    List<EventServiceMapOrder> findByEventId(Long eventId);


    List<EventServiceMapOrder> findAllEventServiceMapOrdersByDateUntilLessGreaterThanNow(ZonedDateTime now);

    List<EventServiceMapOrder> findByServiceMapIdAndBilledFalseAndDateEndSmallerThen(Long serviceMapId, ZonedDateTime now);


    List<EventServiceMapOrder> findByServiceMapIdAndDateEndSmallerThen(Long serviceMapId, ZonedDateTime now);


    List<EventServiceMapOrder> findByServiceMapIdAndBilledTrueAndDateEndSmallerThen(Long serviceMapId, ZonedDateTime now);

    List<EventServiceMapOrder> findAll();

    List<EventServiceMapOrder> findByEventDateEndSmallerThen( ZonedDateTime now);
}
