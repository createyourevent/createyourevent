package org.createyourevent.app.service;

import org.createyourevent.app.domain.DeliveryType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link DeliveryType}.
 */
public interface DeliveryTypeExtService {
    List<DeliveryType> findDeliveryTypeByProductId(Long productId);

    void deleteDeliveryTypeByProductId(Long productId);
}
