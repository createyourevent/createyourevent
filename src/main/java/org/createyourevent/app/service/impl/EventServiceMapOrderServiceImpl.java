package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.EventServiceMapOrder;
import org.createyourevent.app.repository.EventServiceMapOrderRepository;
import org.createyourevent.app.service.EventServiceMapOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventServiceMapOrder}.
 */
@Service
@Transactional
public class EventServiceMapOrderServiceImpl implements EventServiceMapOrderService {

    private final Logger log = LoggerFactory.getLogger(EventServiceMapOrderServiceImpl.class);

    private final EventServiceMapOrderRepository eventServiceMapOrderRepository;

    public EventServiceMapOrderServiceImpl(EventServiceMapOrderRepository eventServiceMapOrderRepository) {
        this.eventServiceMapOrderRepository = eventServiceMapOrderRepository;
    }

    @Override
    public EventServiceMapOrder save(EventServiceMapOrder eventServiceMapOrder) {
        log.debug("Request to save EventServiceMapOrder : {}", eventServiceMapOrder);
        return eventServiceMapOrderRepository.save(eventServiceMapOrder);
    }

    @Override
    public Optional<EventServiceMapOrder> partialUpdate(EventServiceMapOrder eventServiceMapOrder) {
        log.debug("Request to partially update EventServiceMapOrder : {}", eventServiceMapOrder);

        return eventServiceMapOrderRepository
            .findById(eventServiceMapOrder.getId())
            .map(existingEventServiceMapOrder -> {
                if (eventServiceMapOrder.getDate() != null) {
                    existingEventServiceMapOrder.setDate(eventServiceMapOrder.getDate());
                }
                if (eventServiceMapOrder.getDateFrom() != null) {
                    existingEventServiceMapOrder.setDateFrom(eventServiceMapOrder.getDateFrom());
                }
                if (eventServiceMapOrder.getDateUntil() != null) {
                    existingEventServiceMapOrder.setDateUntil(eventServiceMapOrder.getDateUntil());
                }
                if (eventServiceMapOrder.getCostHour() != null) {
                    existingEventServiceMapOrder.setCostHour(eventServiceMapOrder.getCostHour());
                }
                if (eventServiceMapOrder.getRideCosts() != null) {
                    existingEventServiceMapOrder.setRideCosts(eventServiceMapOrder.getRideCosts());
                }
                if (eventServiceMapOrder.getTotal() != null) {
                    existingEventServiceMapOrder.setTotal(eventServiceMapOrder.getTotal());
                }
                if (eventServiceMapOrder.getTotalHours() != null) {
                    existingEventServiceMapOrder.setTotalHours(eventServiceMapOrder.getTotalHours());
                }
                if (eventServiceMapOrder.getKilometre() != null) {
                    existingEventServiceMapOrder.setKilometre(eventServiceMapOrder.getKilometre());
                }
                if (eventServiceMapOrder.getBilled() != null) {
                    existingEventServiceMapOrder.setBilled(eventServiceMapOrder.getBilled());
                }
                if (eventServiceMapOrder.getSeen() != null) {
                    existingEventServiceMapOrder.setSeen(eventServiceMapOrder.getSeen());
                }
                if (eventServiceMapOrder.getApproved() != null) {
                    existingEventServiceMapOrder.setApproved(eventServiceMapOrder.getApproved());
                }

                return existingEventServiceMapOrder;
            })
            .map(eventServiceMapOrderRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventServiceMapOrder> findAll(Pageable pageable) {
        log.debug("Request to get all EventServiceMapOrders");
        return eventServiceMapOrderRepository.findAll(pageable);
    }

    /**
     *  Get all the eventServiceMapOrders where FeeTransaction is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<EventServiceMapOrder> findAllWhereFeeTransactionIsNull() {
        log.debug("Request to get all eventServiceMapOrders where FeeTransaction is null");
        return StreamSupport
            .stream(eventServiceMapOrderRepository.findAll().spliterator(), false)
            .filter(eventServiceMapOrder -> eventServiceMapOrder.getFeeTransaction() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventServiceMapOrder> findOne(Long id) {
        log.debug("Request to get EventServiceMapOrder : {}", id);
        return eventServiceMapOrderRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventServiceMapOrder : {}", id);
        eventServiceMapOrderRepository.deleteById(id);
    }
}
