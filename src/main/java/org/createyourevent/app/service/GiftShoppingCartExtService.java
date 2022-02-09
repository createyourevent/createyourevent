package org.createyourevent.app.service;

import org.createyourevent.app.domain.GiftShoppingCart;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link GiftShoppingCart}.
 */
public interface GiftShoppingCartExtService {

    List<GiftShoppingCart> findByUserId(String userId);
}
