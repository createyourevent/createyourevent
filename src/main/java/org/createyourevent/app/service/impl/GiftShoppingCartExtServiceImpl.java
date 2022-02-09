package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.GiftShoppingCartExtService;
import org.createyourevent.app.service.GiftShoppingCartService;
import org.createyourevent.app.domain.GiftShoppingCart;
import org.createyourevent.app.repository.GiftShoppingCartExtRepository;
import org.createyourevent.app.repository.GiftShoppingCartRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link GiftShoppingCart}.
 */
@Service
@Transactional
public class GiftShoppingCartExtServiceImpl implements GiftShoppingCartExtService {

    private final Logger log = LoggerFactory.getLogger(GiftShoppingCartExtServiceImpl.class);

    private final GiftShoppingCartExtRepository giftShoppingCartExtRepository;

    public GiftShoppingCartExtServiceImpl(GiftShoppingCartExtRepository giftShoppingCartExtRepository) {
        this.giftShoppingCartExtRepository = giftShoppingCartExtRepository;
    }

    @Override
    public List<GiftShoppingCart> findByUserId(String userId) {
        log.debug("List<GiftShoppingCart> findByUserId(String userId)");
        return this.giftShoppingCartExtRepository.findByUserId(userId);
    }


}
