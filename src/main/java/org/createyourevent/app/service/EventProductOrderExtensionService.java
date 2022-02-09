package org.createyourevent.app.service;

import org.createyourevent.app.domain.EventProductOrder;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Service Interface for managing {@link EventProductOrder}.
 */
public interface EventProductOrderExtensionService {

    List<EventProductOrder> findAllByEventId(Long eventId);
    List<EventProductOrder> findAllByProductId(Long productId);
    EventProductOrder findByProductIdAndUserId(Long productId, String userId);
    List<EventProductOrder> findAll();
    List<EventProductOrder> findAllByShopId(Long shopId);

    List<EventProductOrder> findAllByDateFromBetween(ZonedDateTime dateStartFrom, ZonedDateTime dateStartUntil);
    List<EventProductOrder> findAllByProductIdAndDateFromBetween(Long productId, ZonedDateTime dateStartFrom, ZonedDateTime dateStartUntil);
    List<EventProductOrder> findAllByProductIdAndDateUntilBetween(Long productId, ZonedDateTime dateStartFrom, ZonedDateTime dateStartUntil);
    List<EventProductOrder> findAllWithProductIdAndDateFromGreaterThenAndDateUntilSmallerThen(Long id, ZonedDateTime dateFrom, ZonedDateTime dateUntil);
    List<EventProductOrder> findAllEventProductOrderByDateGreaterThen(ZonedDateTime now);

    List<EventProductOrder> findAllByShopIdAndBilledFalseAndDateStartSmallerThen(Long shopId, ZonedDateTime now);
    List<EventProductOrder> findAllByShopIdAndBilledTrueAndDateStartSmallerThen(Long shopId, ZonedDateTime now);

    List<EventProductOrder> findAllByShopIdAndDateStartSmallerThen(Long shopId, ZonedDateTime now);

    List<EventProductOrder> findAllEventProductOrdersWithDateFromRange(ZonedDateTime startTime, ZonedDateTime endTime);
    List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(ZonedDateTime startTime, ZonedDateTime endTime);
    List<EventProductOrder> findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(ZonedDateTime startTime, ZonedDateTime endTime);
    List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(ZonedDateTime startTime, ZonedDateTime endTime);
}
