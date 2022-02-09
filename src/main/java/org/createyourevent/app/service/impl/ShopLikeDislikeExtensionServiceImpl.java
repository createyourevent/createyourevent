package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ShopLikeDislikeExtensionService;
import org.createyourevent.app.domain.ShopLikeDislike;
import org.createyourevent.app.repository.ShopLikeDislikeExtensionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing {@link ShopLikeDislike}.
 */
@Service
@Transactional
public class ShopLikeDislikeExtensionServiceImpl implements ShopLikeDislikeExtensionService {

    private final Logger log = LoggerFactory.getLogger(ShopLikeDislikeExtensionServiceImpl.class);

    private final ShopLikeDislikeExtensionRepository shopLikeDislikeExtensionRepository;

    public ShopLikeDislikeExtensionServiceImpl(ShopLikeDislikeExtensionRepository shopLikeDislikeExtensionRepository) {
        this.shopLikeDislikeExtensionRepository = shopLikeDislikeExtensionRepository;
    }

    @Override
    public List<ShopLikeDislike> findAllByShopId(Long shopId) {
        return shopLikeDislikeExtensionRepository.findAllByShopId(shopId);
    }

    @Override
    public List<ShopLikeDislike> findAllByShopIdAndUserId(Long shopId, String userId) {
        return shopLikeDislikeExtensionRepository.findAllByShopIdAndUserId(shopId, userId);
    }

}
