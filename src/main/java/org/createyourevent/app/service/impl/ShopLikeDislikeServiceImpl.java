package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ShopLikeDislike;
import org.createyourevent.app.repository.ShopLikeDislikeRepository;
import org.createyourevent.app.service.ShopLikeDislikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ShopLikeDislike}.
 */
@Service
@Transactional
public class ShopLikeDislikeServiceImpl implements ShopLikeDislikeService {

    private final Logger log = LoggerFactory.getLogger(ShopLikeDislikeServiceImpl.class);

    private final ShopLikeDislikeRepository shopLikeDislikeRepository;

    public ShopLikeDislikeServiceImpl(ShopLikeDislikeRepository shopLikeDislikeRepository) {
        this.shopLikeDislikeRepository = shopLikeDislikeRepository;
    }

    @Override
    public ShopLikeDislike save(ShopLikeDislike shopLikeDislike) {
        log.debug("Request to save ShopLikeDislike : {}", shopLikeDislike);
        return shopLikeDislikeRepository.save(shopLikeDislike);
    }

    @Override
    public Optional<ShopLikeDislike> partialUpdate(ShopLikeDislike shopLikeDislike) {
        log.debug("Request to partially update ShopLikeDislike : {}", shopLikeDislike);

        return shopLikeDislikeRepository
            .findById(shopLikeDislike.getId())
            .map(existingShopLikeDislike -> {
                if (shopLikeDislike.getLike() != null) {
                    existingShopLikeDislike.setLike(shopLikeDislike.getLike());
                }
                if (shopLikeDislike.getDislike() != null) {
                    existingShopLikeDislike.setDislike(shopLikeDislike.getDislike());
                }
                if (shopLikeDislike.getDate() != null) {
                    existingShopLikeDislike.setDate(shopLikeDislike.getDate());
                }
                if (shopLikeDislike.getComment() != null) {
                    existingShopLikeDislike.setComment(shopLikeDislike.getComment());
                }

                return existingShopLikeDislike;
            })
            .map(shopLikeDislikeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ShopLikeDislike> findAll(Pageable pageable) {
        log.debug("Request to get all ShopLikeDislikes");
        return shopLikeDislikeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ShopLikeDislike> findOne(Long id) {
        log.debug("Request to get ShopLikeDislike : {}", id);
        return shopLikeDislikeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ShopLikeDislike : {}", id);
        shopLikeDislikeRepository.deleteById(id);
    }
}
