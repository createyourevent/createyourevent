package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.EventProductOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventProductOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventProductOrderRepository extends JpaRepository<EventProductOrder, Long> {
    @Query(
        "select eventProductOrder from EventProductOrder eventProductOrder where eventProductOrder.user.login = ?#{principal.preferredUsername}"
    )
    List<EventProductOrder> findByUserIsCurrentUser();
}
