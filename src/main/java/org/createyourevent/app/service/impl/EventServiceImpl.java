package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.Event;
import org.createyourevent.app.repository.EventRepository;
import org.createyourevent.app.service.EventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Event}.
 */
@Service
@Transactional
public class EventServiceImpl implements EventService {

    private final Logger log = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;

    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public Event save(Event event) {
        log.debug("Request to save Event : {}", event);
        return eventRepository.save(event);
    }

    @Override
    public Optional<Event> partialUpdate(Event event) {
        log.debug("Request to partially update Event : {}", event);

        return eventRepository
            .findById(event.getId())
            .map(existingEvent -> {
                if (event.getName() != null) {
                    existingEvent.setName(event.getName());
                }
                if (event.getDescription() != null) {
                    existingEvent.setDescription(event.getDescription());
                }
                if (event.getDateStart() != null) {
                    existingEvent.setDateStart(event.getDateStart());
                }
                if (event.getDateEnd() != null) {
                    existingEvent.setDateEnd(event.getDateEnd());
                }
                if (event.getCategory() != null) {
                    existingEvent.setCategory(event.getCategory());
                }
                if (event.getPrice() != null) {
                    existingEvent.setPrice(event.getPrice());
                }
                if (event.getFlyer() != null) {
                    existingEvent.setFlyer(event.getFlyer());
                }
                if (event.getFlyerContentType() != null) {
                    existingEvent.setFlyerContentType(event.getFlyerContentType());
                }
                if (event.getYoutube() != null) {
                    existingEvent.setYoutube(event.getYoutube());
                }
                if (event.getPrivateOrPublic() != null) {
                    existingEvent.setPrivateOrPublic(event.getPrivateOrPublic());
                }
                if (event.getActive() != null) {
                    existingEvent.setActive(event.getActive());
                }
                if (event.getMinPlacenumber() != null) {
                    existingEvent.setMinPlacenumber(event.getMinPlacenumber());
                }
                if (event.getPlacenumber() != null) {
                    existingEvent.setPlacenumber(event.getPlacenumber());
                }
                if (event.getInvestment() != null) {
                    existingEvent.setInvestment(event.getInvestment());
                }
                if (event.getStatus() != null) {
                    existingEvent.setStatus(event.getStatus());
                }
                if (event.getDefinitelyConfirmed() != null) {
                    existingEvent.setDefinitelyConfirmed(event.getDefinitelyConfirmed());
                }
                if (event.getMotto() != null) {
                    existingEvent.setMotto(event.getMotto());
                }
                if (event.getBilled() != null) {
                    existingEvent.setBilled(event.getBilled());
                }
                if (event.getStars() != null) {
                    existingEvent.setStars(event.getStars());
                }
                if (event.getBilledOrganisator() != null) {
                    existingEvent.setBilledOrganisator(event.getBilledOrganisator());
                }
                if (event.getBilledeCreateYourEvent() != null) {
                    existingEvent.setBilledeCreateYourEvent(event.getBilledeCreateYourEvent());
                }

                return existingEvent;
            })
            .map(eventRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Event> findAll(Pageable pageable) {
        log.debug("Request to get all Events");
        return eventRepository.findAll(pageable);
    }

    public Page<Event> findAllWithEagerRelationships(Pageable pageable) {
        return eventRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     *  Get all the events where FeeTransaction is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Event> findAllWhereFeeTransactionIsNull() {
        log.debug("Request to get all events where FeeTransaction is null");
        return StreamSupport
            .stream(eventRepository.findAll().spliterator(), false)
            .filter(event -> event.getFeeTransaction() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Event> findOne(Long id) {
        log.debug("Request to get Event : {}", id);
        return eventRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
    }
}
