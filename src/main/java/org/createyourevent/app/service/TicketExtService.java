package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Ticket}.
 */
public interface TicketExtService {
    List<Ticket> findByEventId(Long id);
    Ticket findOneById(Long id);
}
