package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Ticket;
import org.createyourevent.app.repository.TicketExtRepository;
import org.createyourevent.app.repository.TicketRepository;
import org.createyourevent.app.service.TicketExtService;
import org.createyourevent.app.service.TicketService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourevent.app.domain.Ticket}.
 */
@RestController
@RequestMapping("/api")
public class TicketExtResource {

    private final Logger log = LoggerFactory.getLogger(TicketExtResource.class);

    private static final String ENTITY_NAME = "ticket";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketExtService ticketExtService;

    private final TicketExtRepository ticketExtRepository;

    public TicketExtResource(TicketExtService ticketExtService, TicketExtRepository ticketExtRepository) {
        this.ticketExtService = ticketExtService;
        this.ticketExtRepository = ticketExtRepository;
    }

    /**
     * {@code GET  /tickets/:id} : get the "id" ticket.
     *
     * @param id the id of the ticket to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticket, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tickets/{id}/getAllTicketsByEventId")
    public List<Ticket> getTicketsWithEventId(@PathVariable Long id) {
        log.debug("REST request to get Ticket : {}", id);
        List<Ticket> tickets = ticketExtService.findByEventId(id);
        return tickets;
    }

    @GetMapping("/tickets/{id}/getOneById")
    public Ticket getTicket(@PathVariable Long id) {
        log.debug("REST request to get Ticket : {}", id);
        Ticket ticket = ticketExtService.findOneById(id);
        return ticket;
    }
}
