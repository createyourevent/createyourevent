package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ShopComment;
import org.createyourevent.app.repository.ShopCommentRepository;
import org.createyourevent.app.service.ShopCommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ShopComment}.
 */
@Service
@Transactional
public class ShopCommentServiceImpl implements ShopCommentService {

    private final Logger log = LoggerFactory.getLogger(ShopCommentServiceImpl.class);

    private final ShopCommentRepository shopCommentRepository;

    public ShopCommentServiceImpl(ShopCommentRepository shopCommentRepository) {
        this.shopCommentRepository = shopCommentRepository;
    }

    @Override
    public ShopComment save(ShopComment shopComment) {
        log.debug("Request to save ShopComment : {}", shopComment);
        return shopCommentRepository.save(shopComment);
    }

    @Override
    public Optional<ShopComment> partialUpdate(ShopComment shopComment) {
        log.debug("Request to partially update ShopComment : {}", shopComment);

        return shopCommentRepository
            .findById(shopComment.getId())
            .map(existingShopComment -> {
                if (shopComment.getComment() != null) {
                    existingShopComment.setComment(shopComment.getComment());
                }
                if (shopComment.getDate() != null) {
                    existingShopComment.setDate(shopComment.getDate());
                }

                return existingShopComment;
            })
            .map(shopCommentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ShopComment> findAll(Pageable pageable) {
        log.debug("Request to get all ShopComments");
        return shopCommentRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ShopComment> findOne(Long id) {
        log.debug("Request to get ShopComment : {}", id);
        return shopCommentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ShopComment : {}", id);
        shopCommentRepository.deleteById(id);
    }
}
