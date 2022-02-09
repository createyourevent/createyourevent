package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.EventServiceMapOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link EventServiceMapOrder}.
 */
public interface EventServiceMapOrderService {
    /**
     * Save a eventServiceMapOrder.
     *
     * @param eventServiceMapOrder the entity to save.
     * @return the persisted entity.
     */
    EventServiceMapOrder save(EventServiceMapOrder eventServiceMapOrder);

    /**
     * Partially updates a eventServiceMapOrder.
     *
     * @param eventServiceMapOrder the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventServiceMapOrder> partialUpdate(EventServiceMapOrder eventServiceMapOrder);

    /**
     * Get all the eventServiceMapOrders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventServiceMapOrder> findAll(Pageable pageable);
    /**
     * Get all the EventServiceMapOrder where FeeTransaction is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<EventServiceMapOrder> findAllWhereFeeTransactionIsNull();

    /**
     * Get the "id" eventServiceMapOrder.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventServiceMapOrder> findOne(Long id);

    /**
     * Delete the "id" eventServiceMapOrder.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
