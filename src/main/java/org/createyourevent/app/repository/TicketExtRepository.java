package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Ticket;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ticket entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketExtRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT DISTINCT t FROM Ticket t left join fetch t.reservation left join fetch t.user left join fetch t.event  WHERE t.id = :id")
    Ticket findOneById(@Param("id") Long id);

    @Query("SELECT DISTINCT t FROM Ticket t WHERE t.event.id = :id")
    List<Ticket> findByEventId(@Param("id") Long id);
}
