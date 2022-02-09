package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Hotel}.
 */
public interface HotelService {
    /**
     * Save a hotel.
     *
     * @param hotel the entity to save.
     * @return the persisted entity.
     */
    Hotel save(Hotel hotel);

    /**
     * Partially updates a hotel.
     *
     * @param hotel the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Hotel> partialUpdate(Hotel hotel);

    /**
     * Get all the hotels.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Hotel> findAll(Pageable pageable);

    /**
     * Get the "id" hotel.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Hotel> findOne(Long id);

    /**
     * Delete the "id" hotel.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
