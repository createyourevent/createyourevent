package org.createyourevent.app.service;

import org.createyourevent.app.domain.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Product}.
 */
public interface ProductExtensionService {

    List<Product> findAllByShopId(Long shopId);

    List<Product> findAllByShopIdAndActiveTrue(Long shopId);

    List<Product> findAllByShopActiveAndActiveTrue();
}
