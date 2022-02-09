package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ProductLikeDislikeExtensionService;
import org.createyourevent.app.service.ProductLikeDislikeService;
import org.createyourevent.app.domain.ProductLikeDislike;
import org.createyourevent.app.repository.ProductLikeDislikeExtensionRepository;
import org.createyourevent.app.repository.ProductLikeDislikeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ProductLikeDislike}.
 */
@Service
@Transactional
public class ProductLikeDislikeExtensionServiceImpl implements ProductLikeDislikeExtensionService {

    private final Logger log = LoggerFactory.getLogger(ProductLikeDislikeExtensionServiceImpl.class);

    private final ProductLikeDislikeExtensionRepository productLikeDislikeExtensionRepository;

    public ProductLikeDislikeExtensionServiceImpl(
            ProductLikeDislikeExtensionRepository productLikeDislikeExtensionRepository) {
        this.productLikeDislikeExtensionRepository = productLikeDislikeExtensionRepository;
    }

    @Override
    public List<ProductLikeDislike> findAllByProductId(Long productId) {
        log.debug("List<ProductLikeDislike> findAllByProductId(Long productId)");
        return productLikeDislikeExtensionRepository.findAllByProductId(productId);
    }

    @Override
    public List<ProductLikeDislike> findAllByProductIdAndUserId(Long productId, String userId) {
        log.debug("List<ProductLikeDislike> findAllByProductIdAndUserId(Long productId, String userId)");
        return productLikeDislikeExtensionRepository.findAllByProductIdAndUserId(productId, userId);
    }


}
