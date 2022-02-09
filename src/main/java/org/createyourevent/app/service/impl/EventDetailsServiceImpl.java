package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.EventDetails;
import org.createyourevent.app.repository.EventDetailsRepository;
import org.createyourevent.app.service.EventDetailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventDetails}.
 */
@Service
@Transactional
public class EventDetailsServiceImpl implements EventDetailsService {

    private final Logger log = LoggerFactory.getLogger(EventDetailsServiceImpl.class);

    private final EventDetailsRepository eventDetailsRepository;

    public EventDetailsServiceImpl(EventDetailsRepository eventDetailsRepository) {
        this.eventDetailsRepository = eventDetailsRepository;
    }

    @Override
    public EventDetails save(EventDetails eventDetails) {
        log.debug("Request to save EventDetails : {}", eventDetails);
        return eventDetailsRepository.save(eventDetails);
    }

    @Override
    public Optional<EventDetails> partialUpdate(EventDetails eventDetails) {
        log.debug("Request to partially update EventDetails : {}", eventDetails);

        return eventDetailsRepository
            .findById(eventDetails.getId())
            .map(existingEventDetails -> {
                if (eventDetails.getTotalEntranceFee() != null) {
                    existingEventDetails.setTotalEntranceFee(eventDetails.getTotalEntranceFee());
                }

                return existingEventDetails;
            })
            .map(eventDetailsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventDetails> findAll(Pageable pageable) {
        log.debug("Request to get all EventDetails");
        return eventDetailsRepository.findAll(pageable);
    }

    /**
     *  Get all the eventDetails where Event is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<EventDetails> findAllWhereEventIsNull() {
        log.debug("Request to get all eventDetails where Event is null");
        return StreamSupport
            .stream(eventDetailsRepository.findAll().spliterator(), false)
            .filter(eventDetails -> eventDetails.getEvent() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventDetails> findOne(Long id) {
        log.debug("Request to get EventDetails : {}", id);
        return eventDetailsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventDetails : {}", id);
        eventDetailsRepository.deleteById(id);
    }
}
