package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ProductComment;
import org.createyourevent.app.repository.ProductCommentRepository;
import org.createyourevent.app.service.ProductCommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ProductComment}.
 */
@Service
@Transactional
public class ProductCommentServiceImpl implements ProductCommentService {

    private final Logger log = LoggerFactory.getLogger(ProductCommentServiceImpl.class);

    private final ProductCommentRepository productCommentRepository;

    public ProductCommentServiceImpl(ProductCommentRepository productCommentRepository) {
        this.productCommentRepository = productCommentRepository;
    }

    @Override
    public ProductComment save(ProductComment productComment) {
        log.debug("Request to save ProductComment : {}", productComment);
        return productCommentRepository.save(productComment);
    }

    @Override
    public Optional<ProductComment> partialUpdate(ProductComment productComment) {
        log.debug("Request to partially update ProductComment : {}", productComment);

        return productCommentRepository
            .findById(productComment.getId())
            .map(existingProductComment -> {
                if (productComment.getComment() != null) {
                    existingProductComment.setComment(productComment.getComment());
                }
                if (productComment.getDate() != null) {
                    existingProductComment.setDate(productComment.getDate());
                }

                return existingProductComment;
            })
            .map(productCommentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductComment> findAll(Pageable pageable) {
        log.debug("Request to get all ProductComments");
        return productCommentRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductComment> findOne(Long id) {
        log.debug("Request to get ProductComment : {}", id);
        return productCommentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ProductComment : {}", id);
        productCommentRepository.deleteById(id);
    }
}
