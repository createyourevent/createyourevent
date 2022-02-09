package org.createyourevent.app.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.createyourevent.app.domain.Shop;
import org.createyourevent.app.domain.enumeration.ProductType;
import org.createyourevent.app.repository.ShopExtensionRepository;
import org.createyourevent.app.service.ShopExtensionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ShopExtensionServiceImpl implements ShopExtensionService {

    private final Logger log = LoggerFactory.getLogger(ShopServiceImpl.class);

    private final ShopExtensionRepository shopExtensionRepository;

    public ShopExtensionServiceImpl(ShopExtensionRepository shopExtensionRepository) {
        this.shopExtensionRepository = shopExtensionRepository;
    }

    @Override
    public List<Shop> findByUserIdAndActiveTrue(String userId) {
        log.debug("Request to get all Shops from a user with active=true");
        return shopExtensionRepository.findByUserIdAndActiveTrue(userId);
    }

    @Override
    public List<Shop> findByCurrentUser() {
        log.debug("Request to get all Shops from active user");
        return shopExtensionRepository.findByCurrentUserAndActive();
    }

    @Override
    public List<Shop> findByProductType(ProductType productType) {
        log.debug("Find all shops by its Productcategory");
        List<Shop> result = shopExtensionRepository.findByProductType(productType);
        return result;
    }

    @Override
    public List<Shop> findByProductTypeAndActiveTrue(ProductType productType) {
        log.debug("Find all shops by its Productcategory and active=true");
        List<Shop> result = shopExtensionRepository.findByProductTypeAndActiveTrue(productType);
        return result;
    }

    @Override
    public List<Shop> findByActiveTrue() {
        log.debug("Find all shops by active=true");
        return shopExtensionRepository.findByActiveTrue();
    }

    public List<Shop> findByActiveTrueAndActiveOwnerTrue() {
        log.debug("Find all shops by active=true and activeOwner = true");
        return shopExtensionRepository.findByActiveTrueAndActiveOwnerTrue();
    }

}
