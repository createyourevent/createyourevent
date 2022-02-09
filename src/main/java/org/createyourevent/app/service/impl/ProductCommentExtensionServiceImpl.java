package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ProductCommentExtensionService;
import org.createyourevent.app.domain.ProductComment;
import org.createyourevent.app.repository.ProductCommentExtensionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service Implementation for managing {@link ProductComment}.
 */
@Service
@Transactional
public class ProductCommentExtensionServiceImpl implements ProductCommentExtensionService {

    private final Logger log = LoggerFactory.getLogger(ProductCommentExtensionServiceImpl.class);

    private final ProductCommentExtensionRepository productCommentExtensionRepository;

    public ProductCommentExtensionServiceImpl(ProductCommentExtensionRepository productCommentExtensionRepository) {
        this.productCommentExtensionRepository = productCommentExtensionRepository;
    }

    @Override
    public List<ProductComment> findAllByProductId(Long productId) {
        List<ProductComment> productComments = this.productCommentExtensionRepository.findAllByProductId(productId);
        List<ProductComment> productCommentsParent = new ArrayList<ProductComment>();

        for(ProductComment productComment : productComments) {
            if(productComment.getProductComment() != null && productComment.getProductComment().getId() == productComment.getId()) {
                productComment.getProductComments().add(productComment.getProductComment());
            }
        }
        for(ProductComment productComment : productComments) {
            if(productComment.getProductComment() == null ) {
                productCommentsParent.add(productComment);
            }
        }
        return productCommentsParent;
    }

    @Override
    public List<ProductComment> findAllByProductIdAndUserId(Long productId, String userId) {
        log.debug("List<ProductComment> findAllByProductIdAndUserId(Long productId, String userId)");
        return productCommentExtensionRepository.findAllByProductIdAndUserId(productId, userId);
    }


}
