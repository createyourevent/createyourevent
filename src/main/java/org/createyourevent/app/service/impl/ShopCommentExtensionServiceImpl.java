package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ShopCommentExtensionService;
import org.createyourevent.app.service.ShopCommentService;
import org.createyourevent.app.domain.ShopComment;
import org.createyourevent.app.repository.ShopCommentExtensionRepository;
import org.createyourevent.app.repository.ShopCommentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ShopComment}.
 */
@Service
@Transactional
public class ShopCommentExtensionServiceImpl implements ShopCommentExtensionService {

    private final Logger log = LoggerFactory.getLogger(ShopCommentExtensionServiceImpl.class);

    private final ShopCommentExtensionRepository shopCommentExtensionRepository;

    private final ShopCommentRepository shopCommentRepository;

    public ShopCommentExtensionServiceImpl(ShopCommentExtensionRepository shopCommentExtensionRepository, ShopCommentRepository shopCommentRepository) {
        this.shopCommentExtensionRepository = shopCommentExtensionRepository;
        this.shopCommentRepository = shopCommentRepository;
    }



    @Override
    public List<ShopComment> findAllByShopId(Long shopId) {
        List<ShopComment> shopComments = this.shopCommentExtensionRepository.findAllByShopId(shopId);
        List<ShopComment> shopCommentsParent = new ArrayList<ShopComment>();

        for(ShopComment shopComment : shopComments) {
            if(shopComment.getShopComment() != null && shopComment.getShopComment().getId() == shopComment.getId()) {
                shopComment.getShopComments().add(shopComment.getShopComment());
            }
        }
        for(ShopComment shopComment : shopComments) {
            if(shopComment.getShopComment() == null ) {
                shopCommentsParent.add(shopComment);
            }
        }
        return shopCommentsParent;
    }

    @Override
    public List<ShopComment> findAllByShopIdAndUserId(Long shopId, String userId) {
        return this.shopCommentExtensionRepository.findAllByShopIdAndUserId(shopId, userId);
    }

    @Override
    public List<ShopComment> findAll() {
        List<ShopComment> shopComments = this.shopCommentRepository.findAll();
        for(ShopComment shopComment : shopComments) {
            if(shopComment.getShopComment().getId() != null && shopComment.getShopComment().getId() == shopComment.getId()) {
                shopComment.getShopComments().add(shopComment.getShopComment());
            }
        }
        return shopComments;
    }


}
