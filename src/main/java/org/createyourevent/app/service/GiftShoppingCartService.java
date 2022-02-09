package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.GiftShoppingCart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link GiftShoppingCart}.
 */
public interface GiftShoppingCartService {
    /**
     * Save a giftShoppingCart.
     *
     * @param giftShoppingCart the entity to save.
     * @return the persisted entity.
     */
    GiftShoppingCart save(GiftShoppingCart giftShoppingCart);

    /**
     * Partially updates a giftShoppingCart.
     *
     * @param giftShoppingCart the entity to update partially.
     * @return the persisted entity.
     */
    Optional<GiftShoppingCart> partialUpdate(GiftShoppingCart giftShoppingCart);

    /**
     * Get all the giftShoppingCarts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<GiftShoppingCart> findAll(Pageable pageable);

    /**
     * Get the "id" giftShoppingCart.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<GiftShoppingCart> findOne(Long id);

    /**
     * Delete the "id" giftShoppingCart.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
