package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.EventServiceMapOrderExtService;
import org.createyourevent.app.service.EventServiceMapOrderService;
import org.createyourevent.app.domain.EventServiceMapOrder;
import org.createyourevent.app.repository.EventServiceMapOrderExtRepository;
import org.createyourevent.app.repository.EventServiceMapOrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link EventServiceMapOrder}.
 */
@Service
@Transactional
public class EventServiceMapOrderExtServiceImpl implements EventServiceMapOrderExtService {

    private final Logger log = LoggerFactory.getLogger(EventServiceMapOrderServiceImpl.class);

    private final EventServiceMapOrderExtRepository eventServiceMapOrderExtRepository;

    public EventServiceMapOrderExtServiceImpl(EventServiceMapOrderExtRepository eventServiceMapOrderExtRepository) {
        this.eventServiceMapOrderExtRepository = eventServiceMapOrderExtRepository;
    }

    @Override
    public List<EventServiceMapOrder> findByServiceMapId(Long serviceMapId) {
        log.debug("find EventServiceMapOrder By ServiceMapId");
        return this.eventServiceMapOrderExtRepository.findByServiceMapId(serviceMapId);
    }

    @Override
    public List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateRange(ZonedDateTime startTime,
            ZonedDateTime endTime) {
        List<EventServiceMapOrder>   orders =  this.eventServiceMapOrderExtRepository.findAllEventServiceMapOrdersWithDateFromRange(startTime, endTime);
        return orders;
    }


    @Override
    public List<EventServiceMapOrder> findByEventId(Long eventId) {
        log.debug("find EventServiceMapOrder By ServiceMapId");
        return this.eventServiceMapOrderExtRepository.findByEventId(eventId);
    }

    @Override
    public List<EventServiceMapOrder> findAllEventServiceMapOrdersByDateUntilLessGreaterThanNow(ZonedDateTime now) {
        List<EventServiceMapOrder>   orders =  this.eventServiceMapOrderExtRepository.findAllByDateUntilLessGreaterThanNow(now);
        return orders;
    }

    @Override
    public List<EventServiceMapOrder> findByServiceMapIdAndBilledFalseAndDateEndSmallerThen(Long serviceMapId,
            ZonedDateTime now) {
                List<EventServiceMapOrder>   orders =  this.eventServiceMapOrderExtRepository.findByServiceMapIdAndBilledFalseAndDateEndSmallerThen(serviceMapId, now);
                return orders;
    }


    @Override
    public List<EventServiceMapOrder> findAll() {
        return eventServiceMapOrderExtRepository.findAll();
    }

    @Override
    public List<EventServiceMapOrder> findByServiceMapIdAndBilledTrueAndDateEndSmallerThen(Long serviceMapId,
            ZonedDateTime now) {
                List<EventServiceMapOrder>   orders =  this.eventServiceMapOrderExtRepository.findByServiceMapIdAndBilledTrueAndDateEndSmallerThen(serviceMapId, now);
                return orders;
    }

    @Override
    public List<EventServiceMapOrder> findByServiceMapIdAndDateEndSmallerThen(Long serviceMapId, ZonedDateTime now) {
        List<EventServiceMapOrder>   orders =  this.eventServiceMapOrderExtRepository.findByServiceMapIdAndDateEndSmallerThen(serviceMapId, now);
        return orders;
    }

    @Override
    public List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateFromRangeAndEventId( Long eventId, ZonedDateTime startTime,
            ZonedDateTime endTime) {
                List<EventServiceMapOrder> orders =  this.eventServiceMapOrderExtRepository.findAllEventServiceMapOrdersWithDateFromRangeAndEventId(eventId, startTime, endTime);
                return orders;
    }

    @Override
    public List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateRangeAndServiceMapId(Long serviceMapId,
            ZonedDateTime startTime, ZonedDateTime endTime) {
                List<EventServiceMapOrder>   orders =  this.eventServiceMapOrderExtRepository.findAllEventServiceMapOrdersWithDateFromRangeAndServiceMapId(serviceMapId, startTime, endTime);
                return orders;
    }

    @Override
    public List<EventServiceMapOrder> findByEventDateEndSmallerThen(ZonedDateTime now) {
        List<EventServiceMapOrder>   orders =  this.eventServiceMapOrderExtRepository.findByEventDateEndSmallerThen(now);
        return orders;
    }



}
