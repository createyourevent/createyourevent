package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Cart}.
 */
public interface CartService {
    /**
     * Save a cart.
     *
     * @param cart the entity to save.
     * @return the persisted entity.
     */
    Cart save(Cart cart);

    /**
     * Partially updates a cart.
     *
     * @param cart the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Cart> partialUpdate(Cart cart);

    /**
     * Get all the carts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Cart> findAll(Pageable pageable);

    /**
     * Get the "id" cart.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Cart> findOne(Long id);

    /**
     * Delete the "id" cart.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
