package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.EventProductOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link EventProductOrder}.
 */
public interface EventProductOrderService {
    /**
     * Save a eventProductOrder.
     *
     * @param eventProductOrder the entity to save.
     * @return the persisted entity.
     */
    EventProductOrder save(EventProductOrder eventProductOrder);

    /**
     * Partially updates a eventProductOrder.
     *
     * @param eventProductOrder the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventProductOrder> partialUpdate(EventProductOrder eventProductOrder);

    /**
     * Get all the eventProductOrders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventProductOrder> findAll(Pageable pageable);
    /**
     * Get all the EventProductOrder where FeeTransaction is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<EventProductOrder> findAllWhereFeeTransactionIsNull();

    /**
     * Get the "id" eventProductOrder.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventProductOrder> findOne(Long id);

    /**
     * Delete the "id" eventProductOrder.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
