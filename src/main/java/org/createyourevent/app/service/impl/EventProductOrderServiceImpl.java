package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.EventProductOrder;
import org.createyourevent.app.repository.EventProductOrderRepository;
import org.createyourevent.app.service.EventProductOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventProductOrder}.
 */
@Service
@Transactional
public class EventProductOrderServiceImpl implements EventProductOrderService {

    private final Logger log = LoggerFactory.getLogger(EventProductOrderServiceImpl.class);

    private final EventProductOrderRepository eventProductOrderRepository;

    public EventProductOrderServiceImpl(EventProductOrderRepository eventProductOrderRepository) {
        this.eventProductOrderRepository = eventProductOrderRepository;
    }

    @Override
    public EventProductOrder save(EventProductOrder eventProductOrder) {
        log.debug("Request to save EventProductOrder : {}", eventProductOrder);
        return eventProductOrderRepository.save(eventProductOrder);
    }

    @Override
    public Optional<EventProductOrder> partialUpdate(EventProductOrder eventProductOrder) {
        log.debug("Request to partially update EventProductOrder : {}", eventProductOrder);

        return eventProductOrderRepository
            .findById(eventProductOrder.getId())
            .map(existingEventProductOrder -> {
                if (eventProductOrder.getAmount() != null) {
                    existingEventProductOrder.setAmount(eventProductOrder.getAmount());
                }
                if (eventProductOrder.getTotal() != null) {
                    existingEventProductOrder.setTotal(eventProductOrder.getTotal());
                }
                if (eventProductOrder.getDate() != null) {
                    existingEventProductOrder.setDate(eventProductOrder.getDate());
                }
                if (eventProductOrder.getRentalPeriod() != null) {
                    existingEventProductOrder.setRentalPeriod(eventProductOrder.getRentalPeriod());
                }
                if (eventProductOrder.getDateFrom() != null) {
                    existingEventProductOrder.setDateFrom(eventProductOrder.getDateFrom());
                }
                if (eventProductOrder.getDateUntil() != null) {
                    existingEventProductOrder.setDateUntil(eventProductOrder.getDateUntil());
                }
                if (eventProductOrder.getStatus() != null) {
                    existingEventProductOrder.setStatus(eventProductOrder.getStatus());
                }
                if (eventProductOrder.getBilled() != null) {
                    existingEventProductOrder.setBilled(eventProductOrder.getBilled());
                }
                if (eventProductOrder.getSeen() != null) {
                    existingEventProductOrder.setSeen(eventProductOrder.getSeen());
                }
                if (eventProductOrder.getApproved() != null) {
                    existingEventProductOrder.setApproved(eventProductOrder.getApproved());
                }
                if (eventProductOrder.getSellingPrice() != null) {
                    existingEventProductOrder.setSellingPrice(eventProductOrder.getSellingPrice());
                }

                return existingEventProductOrder;
            })
            .map(eventProductOrderRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventProductOrder> findAll(Pageable pageable) {
        log.debug("Request to get all EventProductOrders");
        return eventProductOrderRepository.findAll(pageable);
    }

    /**
     *  Get all the eventProductOrders where FeeTransaction is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<EventProductOrder> findAllWhereFeeTransactionIsNull() {
        log.debug("Request to get all eventProductOrders where FeeTransaction is null");
        return StreamSupport
            .stream(eventProductOrderRepository.findAll().spliterator(), false)
            .filter(eventProductOrder -> eventProductOrder.getFeeTransaction() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventProductOrder> findOne(Long id) {
        log.debug("Request to get EventProductOrder : {}", id);
        return eventProductOrderRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventProductOrder : {}", id);
        eventProductOrderRepository.deleteById(id);
    }
}
