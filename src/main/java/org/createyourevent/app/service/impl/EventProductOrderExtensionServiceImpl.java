package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.EventProductOrderExtensionService;
import org.createyourevent.app.service.EventProductOrderService;
import org.createyourevent.app.domain.EventProductOrder;
import org.createyourevent.app.repository.EventProductOrderExtensionRepository;
import org.createyourevent.app.repository.EventProductOrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link EventProductOrder}.
 */
@Service
@Transactional
public class EventProductOrderExtensionServiceImpl implements EventProductOrderExtensionService {

    private final Logger log = LoggerFactory.getLogger(EventProductOrderServiceImpl.class);

    private final EventProductOrderExtensionRepository eventProductOrderExtensionRepository;

    public EventProductOrderExtensionServiceImpl(
            EventProductOrderExtensionRepository eventProductOrderExtensionRepository) {
        this.eventProductOrderExtensionRepository = eventProductOrderExtensionRepository;
    }

    @Override
    public List<EventProductOrder> findAllByEventId(Long eventId) {
        log.info("findAllByEventId");
        List<EventProductOrder> l = eventProductOrderExtensionRepository.findAllByEventId(eventId);
        return l;
    }

    @Override
    public List<EventProductOrder> findAllByProductId(Long productId) {
        log.info("findAllByProductId");
        return eventProductOrderExtensionRepository.findAllByProductId(productId);
    }

    @Override
    public EventProductOrder findByProductIdAndUserId(Long productId, String userId) {
        log.info("findByProductIdAndUserId");
        return eventProductOrderExtensionRepository.findByProductIdAndUserId(productId, userId);
    }

    @Override
    public List<EventProductOrder> findAll() {
        log.info("List<EventProductOrder> findAll()");
        return eventProductOrderExtensionRepository.findAll();
    }

    @Override
    public List<EventProductOrder> findAllByDateFromBetween(ZonedDateTime dateStartFrom, ZonedDateTime dateStartUntil) {
        return eventProductOrderExtensionRepository.findAllByDateFromBetween(dateStartFrom, dateStartUntil);
    }

    @Override
    public List<EventProductOrder> findAllByProductIdAndDateFromBetween(Long productId, ZonedDateTime dateStartFrom,
    ZonedDateTime dateStartUntil) {
        return eventProductOrderExtensionRepository.findAllByProductIdAndDateFromBetween(productId, dateStartFrom, dateStartUntil);
    }

    @Override
    public List<EventProductOrder> findAllByShopId(Long shopId) {
        log.info("List<EventProductOrder> findAllByShopId(Long shopId)");
        return eventProductOrderExtensionRepository.findAllByShopId(shopId);
    }

    @Override
    public List<EventProductOrder> findAllWithProductIdAndDateFromGreaterThenAndDateUntilSmallerThen(Long id, ZonedDateTime dateFrom, ZonedDateTime dateUntil) {
        return eventProductOrderExtensionRepository.findAllWithProductIdAndDateFromGreaterThenAndDateUntilSmallerThen(id, dateFrom, dateUntil);
    }

    @Override
    public List<EventProductOrder> findAllByProductIdAndDateUntilBetween(Long productId, ZonedDateTime dateStartFrom,
            ZonedDateTime dateStartUntil) {
        return eventProductOrderExtensionRepository.findAllByProductIdAndDateUntilBetween(productId, dateStartFrom, dateStartUntil);
    }

    @Override
    public List<EventProductOrder> findAllEventProductOrderByDateGreaterThen(ZonedDateTime now) {
        List<EventProductOrder>   orders =  this.eventProductOrderExtensionRepository.findAllByDateGreaterThen(now);
        return orders;
    }

    @Override
    public List<EventProductOrder> findAllByShopIdAndBilledFalseAndDateStartSmallerThen(Long shopId, ZonedDateTime now) {
        List<EventProductOrder>   orders =  this.eventProductOrderExtensionRepository.findAllByShopIdAndBilledFalseAndDateStartSmallerThen(shopId, now);
        return orders;
    }

    @Override
    public List<EventProductOrder> findAllByShopIdAndBilledTrueAndDateStartSmallerThen(Long shopId, ZonedDateTime now) {
        List<EventProductOrder>   orders =  this.eventProductOrderExtensionRepository.findAllByShopIdAndBilledTrueAndDateStartSmallerThen(shopId, now);
        return orders;
    }



    @Override
    public List<EventProductOrder> findAllEventProductOrdersWithDateFromRange(ZonedDateTime startTime, ZonedDateTime endTime) {
                List<EventProductOrder>   orders = this.eventProductOrderExtensionRepository.findAllEventProductOrdersWithDateFromRange(startTime, endTime);
                return orders;
    }

    @Override
    public List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(ZonedDateTime startTime, ZonedDateTime endTime) {
                List<EventProductOrder>   orders = this.eventProductOrderExtensionRepository.findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(startTime, endTime);
                return orders;
    }

    @Override
    public List<EventProductOrder> findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(ZonedDateTime startTime, ZonedDateTime endTime) {
                List<EventProductOrder>   orders = this.eventProductOrderExtensionRepository.findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(startTime, endTime);
                return orders;
    }

    @Override
    public List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(ZonedDateTime startTime, ZonedDateTime endTime) {
                List<EventProductOrder>   orders = this.eventProductOrderExtensionRepository.findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(startTime, endTime);
                return orders;
    }

    @Override
    public List<EventProductOrder> findAllByShopIdAndDateStartSmallerThen(Long shopId, ZonedDateTime now) {
        return eventProductOrderExtensionRepository.findAllByShopIdAndDateStartSmallerThen(shopId, now);
    }
}
