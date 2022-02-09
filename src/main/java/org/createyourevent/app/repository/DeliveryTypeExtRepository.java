package org.createyourevent.app.repository;

import org.createyourevent.app.domain.DeliveryType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the DeliveryType entity.
 */
@Repository
public interface DeliveryTypeExtRepository extends JpaRepository<DeliveryType, Long> {
    List<DeliveryType> findByProductId(Long productId);

    @Modifying
    void deleteByProductId(Long productId);
}
