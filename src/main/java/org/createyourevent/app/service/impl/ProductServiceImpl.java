package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Product;
import org.createyourevent.app.repository.ProductRepository;
import org.createyourevent.app.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Product}.
 */
@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product save(Product product) {
        log.debug("Request to save Product : {}", product);
        return productRepository.save(product);
    }

    @Override
    public Optional<Product> partialUpdate(Product product) {
        log.debug("Request to partially update Product : {}", product);

        return productRepository
            .findById(product.getId())
            .map(existingProduct -> {
                if (product.getTitle() != null) {
                    existingProduct.setTitle(product.getTitle());
                }
                if (product.getKeywords() != null) {
                    existingProduct.setKeywords(product.getKeywords());
                }
                if (product.getDescription() != null) {
                    existingProduct.setDescription(product.getDescription());
                }
                if (product.getDateAdded() != null) {
                    existingProduct.setDateAdded(product.getDateAdded());
                }
                if (product.getDateModified() != null) {
                    existingProduct.setDateModified(product.getDateModified());
                }
                if (product.getPriceType() != null) {
                    existingProduct.setPriceType(product.getPriceType());
                }
                if (product.getRentType() != null) {
                    existingProduct.setRentType(product.getRentType());
                }
                if (product.getPrice() != null) {
                    existingProduct.setPrice(product.getPrice());
                }
                if (product.getPhoto() != null) {
                    existingProduct.setPhoto(product.getPhoto());
                }
                if (product.getPhotoContentType() != null) {
                    existingProduct.setPhotoContentType(product.getPhotoContentType());
                }
                if (product.getPhoto2() != null) {
                    existingProduct.setPhoto2(product.getPhoto2());
                }
                if (product.getPhoto2ContentType() != null) {
                    existingProduct.setPhoto2ContentType(product.getPhoto2ContentType());
                }
                if (product.getPhoto3() != null) {
                    existingProduct.setPhoto3(product.getPhoto3());
                }
                if (product.getPhoto3ContentType() != null) {
                    existingProduct.setPhoto3ContentType(product.getPhoto3ContentType());
                }
                if (product.getYoutube() != null) {
                    existingProduct.setYoutube(product.getYoutube());
                }
                if (product.getActive() != null) {
                    existingProduct.setActive(product.getActive());
                }
                if (product.getStock() != null) {
                    existingProduct.setStock(product.getStock());
                }
                if (product.getProductType() != null) {
                    existingProduct.setProductType(product.getProductType());
                }
                if (product.getItemNumber() != null) {
                    existingProduct.setItemNumber(product.getItemNumber());
                }
                if (product.getStatus() != null) {
                    existingProduct.setStatus(product.getStatus());
                }
                if (product.getUnit() != null) {
                    existingProduct.setUnit(product.getUnit());
                }
                if (product.getAmount() != null) {
                    existingProduct.setAmount(product.getAmount());
                }
                if (product.getMotto() != null) {
                    existingProduct.setMotto(product.getMotto());
                }

                return existingProduct;
            })
            .map(productRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Product> findAll(Pageable pageable) {
        log.debug("Request to get all Products");
        return productRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Product> findOne(Long id) {
        log.debug("Request to get Product : {}", id);
        return productRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Product : {}", id);
        productRepository.deleteById(id);
    }
}
