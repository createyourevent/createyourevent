package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Point}.
 */
public interface PointService {
    /**
     * Save a point.
     *
     * @param point the entity to save.
     * @return the persisted entity.
     */
    Point save(Point point);

    /**
     * Partially updates a point.
     *
     * @param point the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Point> partialUpdate(Point point);

    /**
     * Get all the points.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Point> findAll(Pageable pageable);

    /**
     * Get the "id" point.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Point> findOne(Long id);

    /**
     * Delete the "id" point.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
