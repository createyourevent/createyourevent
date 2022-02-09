package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.Ticket;
import org.createyourevent.app.repository.TicketRepository;
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
public class TicketServiceImpl implements TicketService {

    private final Logger log = LoggerFactory.getLogger(TicketServiceImpl.class);

    private final TicketRepository ticketRepository;

    public TicketServiceImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public Ticket save(Ticket ticket) {
        log.debug("Request to save Ticket : {}", ticket);
        return ticketRepository.save(ticket);
    }

    @Override
    public Optional<Ticket> partialUpdate(Ticket ticket) {
        log.debug("Request to partially update Ticket : {}", ticket);

        return ticketRepository
            .findById(ticket.getId())
            .map(existingTicket -> {
                if (ticket.getAmount() != null) {
                    existingTicket.setAmount(ticket.getAmount());
                }
                if (ticket.getTotal() != null) {
                    existingTicket.setTotal(ticket.getTotal());
                }
                if (ticket.getDate() != null) {
                    existingTicket.setDate(ticket.getDate());
                }
                if (ticket.getRefNo() != null) {
                    existingTicket.setRefNo(ticket.getRefNo());
                }
                if (ticket.getAccessDate() != null) {
                    existingTicket.setAccessDate(ticket.getAccessDate());
                }
                if (ticket.getTicketsUsed() != null) {
                    existingTicket.setTicketsUsed(ticket.getTicketsUsed());
                }

                return existingTicket;
            })
            .map(ticketRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Ticket> findAll(Pageable pageable) {
        log.debug("Request to get all Tickets");
        return ticketRepository.findAll(pageable);
    }

    /**
     *  Get all the tickets where Reservation is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Ticket> findAllWhereReservationIsNull() {
        log.debug("Request to get all tickets where Reservation is null");
        return StreamSupport
            .stream(ticketRepository.findAll().spliterator(), false)
            .filter(ticket -> ticket.getReservation() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Ticket> findOne(Long id) {
        log.debug("Request to get Ticket : {}", id);
        return ticketRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Ticket : {}", id);
        ticketRepository.deleteById(id);
    }
}
