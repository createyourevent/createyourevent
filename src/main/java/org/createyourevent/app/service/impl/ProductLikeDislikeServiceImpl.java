package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ProductLikeDislike;
import org.createyourevent.app.repository.ProductLikeDislikeRepository;
import org.createyourevent.app.service.ProductLikeDislikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ProductLikeDislike}.
 */
@Service
@Transactional
public class ProductLikeDislikeServiceImpl implements ProductLikeDislikeService {

    private final Logger log = LoggerFactory.getLogger(ProductLikeDislikeServiceImpl.class);

    private final ProductLikeDislikeRepository productLikeDislikeRepository;

    public ProductLikeDislikeServiceImpl(ProductLikeDislikeRepository productLikeDislikeRepository) {
        this.productLikeDislikeRepository = productLikeDislikeRepository;
    }

    @Override
    public ProductLikeDislike save(ProductLikeDislike productLikeDislike) {
        log.debug("Request to save ProductLikeDislike : {}", productLikeDislike);
        return productLikeDislikeRepository.save(productLikeDislike);
    }

    @Override
    public Optional<ProductLikeDislike> partialUpdate(ProductLikeDislike productLikeDislike) {
        log.debug("Request to partially update ProductLikeDislike : {}", productLikeDislike);

        return productLikeDislikeRepository
            .findById(productLikeDislike.getId())
            .map(existingProductLikeDislike -> {
                if (productLikeDislike.getLike() != null) {
                    existingProductLikeDislike.setLike(productLikeDislike.getLike());
                }
                if (productLikeDislike.getDislike() != null) {
                    existingProductLikeDislike.setDislike(productLikeDislike.getDislike());
                }
                if (productLikeDislike.getDate() != null) {
                    existingProductLikeDislike.setDate(productLikeDislike.getDate());
                }
                if (productLikeDislike.getComment() != null) {
                    existingProductLikeDislike.setComment(productLikeDislike.getComment());
                }

                return existingProductLikeDislike;
            })
            .map(productLikeDislikeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductLikeDislike> findAll(Pageable pageable) {
        log.debug("Request to get all ProductLikeDislikes");
        return productLikeDislikeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductLikeDislike> findOne(Long id) {
        log.debug("Request to get ProductLikeDislike : {}", id);
        return productLikeDislikeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ProductLikeDislike : {}", id);
        productLikeDislikeRepository.deleteById(id);
    }
}
