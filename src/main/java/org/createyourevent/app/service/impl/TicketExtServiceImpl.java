package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Ticket;
import org.createyourevent.app.repository.TicketExtRepository;
import org.createyourevent.app.repository.TicketRepository;
import org.createyourevent.app.service.TicketExtService;
import org.createyourevent.app.service.TicketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Ticket}.
 */
@Service
@Transactional
public class TicketExtServiceImpl implements TicketExtService {

    private final Logger log = LoggerFactory.getLogger(TicketServiceImpl.class);

    private final TicketExtRepository ticketExtRepository;

    public TicketExtServiceImpl(TicketExtRepository ticketExtRepository) {
        this.ticketExtRepository = ticketExtRepository;
    }

    @Override
    public List<Ticket> findByEventId(Long id) {
        return ticketExtRepository.findByEventId(id);
    }

    @Override
    public Ticket findOneById(Long id) {
        return ticketExtRepository.findOneById(id);
    }




}
