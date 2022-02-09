package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Shop}.
 */
public interface ShopService {
    /**
     * Save a shop.
     *
     * @param shop the entity to save.
     * @return the persisted entity.
     */
    Shop save(Shop shop);

    /**
     * Partially updates a shop.
     *
     * @param shop the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Shop> partialUpdate(Shop shop);

    /**
     * Get all the shops.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Shop> findAll(Pageable pageable);

    /**
     * Get the "id" shop.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Shop> findOne(Long id);

    /**
     * Delete the "id" shop.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
