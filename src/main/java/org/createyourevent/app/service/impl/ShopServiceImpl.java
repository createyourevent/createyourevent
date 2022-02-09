package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Shop;
import org.createyourevent.app.repository.ShopRepository;
import org.createyourevent.app.service.ShopService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Shop}.
 */
@Service
@Transactional
public class ShopServiceImpl implements ShopService {

    private final Logger log = LoggerFactory.getLogger(ShopServiceImpl.class);

    private final ShopRepository shopRepository;

    public ShopServiceImpl(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    @Override
    public Shop save(Shop shop) {
        log.debug("Request to save Shop : {}", shop);
        return shopRepository.save(shop);
    }

    @Override
    public Optional<Shop> partialUpdate(Shop shop) {
        log.debug("Request to partially update Shop : {}", shop);

        return shopRepository
            .findById(shop.getId())
            .map(existingShop -> {
                if (shop.getName() != null) {
                    existingShop.setName(shop.getName());
                }
                if (shop.getProductType() != null) {
                    existingShop.setProductType(shop.getProductType());
                }
                if (shop.getLogo() != null) {
                    existingShop.setLogo(shop.getLogo());
                }
                if (shop.getLogoContentType() != null) {
                    existingShop.setLogoContentType(shop.getLogoContentType());
                }
                if (shop.getActive() != null) {
                    existingShop.setActive(shop.getActive());
                }
                if (shop.getActiveOwner() != null) {
                    existingShop.setActiveOwner(shop.getActiveOwner());
                }
                if (shop.getDescription() != null) {
                    existingShop.setDescription(shop.getDescription());
                }
                if (shop.getAddress() != null) {
                    existingShop.setAddress(shop.getAddress());
                }
                if (shop.getMotto() != null) {
                    existingShop.setMotto(shop.getMotto());
                }
                if (shop.getPhone() != null) {
                    existingShop.setPhone(shop.getPhone());
                }
                if (shop.getWebAddress() != null) {
                    existingShop.setWebAddress(shop.getWebAddress());
                }

                return existingShop;
            })
            .map(shopRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Shop> findAll(Pageable pageable) {
        log.debug("Request to get all Shops");
        return shopRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Shop> findOne(Long id) {
        log.debug("Request to get Shop : {}", id);
        return shopRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Shop : {}", id);
        shopRepository.deleteById(id);
    }
}
