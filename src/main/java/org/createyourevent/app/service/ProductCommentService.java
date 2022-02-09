package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ProductComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ProductComment}.
 */
public interface ProductCommentService {
    /**
     * Save a productComment.
     *
     * @param productComment the entity to save.
     * @return the persisted entity.
     */
    ProductComment save(ProductComment productComment);

    /**
     * Partially updates a productComment.
     *
     * @param productComment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProductComment> partialUpdate(ProductComment productComment);

    /**
     * Get all the productComments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ProductComment> findAll(Pageable pageable);

    /**
     * Get the "id" productComment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProductComment> findOne(Long id);

    /**
     * Delete the "id" productComment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
