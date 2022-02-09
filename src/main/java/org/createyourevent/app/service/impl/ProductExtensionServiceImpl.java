package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ProductExtensionService;
import org.createyourevent.app.service.ProductService;
import org.createyourevent.app.domain.Product;
import org.createyourevent.app.repository.ProductExtensionRepository;
import org.createyourevent.app.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Product}.
 */
@Service
@Transactional
public class ProductExtensionServiceImpl implements ProductExtensionService {

    private final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductExtensionRepository productExtensionRepository;

    public ProductExtensionServiceImpl(ProductExtensionRepository productExtensionRepository) {
        this.productExtensionRepository = productExtensionRepository;
    }

    @Override
    public List<Product> findAllByShopId(Long shopId) {
        return productExtensionRepository.findAllByShopId(shopId);
    }

    @Override
    public List<Product> findAllByShopIdAndActiveTrue(Long shopId) {
        log.info("findAllByShopIdAndActiveTrue");
        return productExtensionRepository.findAllByShopIdAndActiveTrue(shopId);
    }

    @Override
    public List<Product> findAllByShopActiveAndActiveTrue() {
        log.info("findAllByShopActiveAndActiveTrue()");
        return productExtensionRepository.findAllByShopActiveAndActiveTrue();
    }


}
