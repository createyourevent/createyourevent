package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Ticket;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ticket entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("select ticket from Ticket ticket where ticket.user.login = ?#{principal.preferredUsername}")
    List<Ticket> findByUserIsCurrentUser();
}
