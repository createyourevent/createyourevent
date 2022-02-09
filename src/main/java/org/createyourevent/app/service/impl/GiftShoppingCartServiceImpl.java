package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.GiftShoppingCart;
import org.createyourevent.app.repository.GiftShoppingCartRepository;
import org.createyourevent.app.service.GiftShoppingCartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link GiftShoppingCart}.
 */
@Service
@Transactional
public class GiftShoppingCartServiceImpl implements GiftShoppingCartService {

    private final Logger log = LoggerFactory.getLogger(GiftShoppingCartServiceImpl.class);

    private final GiftShoppingCartRepository giftShoppingCartRepository;

    public GiftShoppingCartServiceImpl(GiftShoppingCartRepository giftShoppingCartRepository) {
        this.giftShoppingCartRepository = giftShoppingCartRepository;
    }

    @Override
    public GiftShoppingCart save(GiftShoppingCart giftShoppingCart) {
        log.debug("Request to save GiftShoppingCart : {}", giftShoppingCart);
        return giftShoppingCartRepository.save(giftShoppingCart);
    }

    @Override
    public Optional<GiftShoppingCart> partialUpdate(GiftShoppingCart giftShoppingCart) {
        log.debug("Request to partially update GiftShoppingCart : {}", giftShoppingCart);

        return giftShoppingCartRepository
            .findById(giftShoppingCart.getId())
            .map(existingGiftShoppingCart -> {
                if (giftShoppingCart.getDate() != null) {
                    existingGiftShoppingCart.setDate(giftShoppingCart.getDate());
                }
                if (giftShoppingCart.getAmount() != null) {
                    existingGiftShoppingCart.setAmount(giftShoppingCart.getAmount());
                }

                return existingGiftShoppingCart;
            })
            .map(giftShoppingCartRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GiftShoppingCart> findAll(Pageable pageable) {
        log.debug("Request to get all GiftShoppingCarts");
        return giftShoppingCartRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GiftShoppingCart> findOne(Long id) {
        log.debug("Request to get GiftShoppingCart : {}", id);
        return giftShoppingCartRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete GiftShoppingCart : {}", id);
        giftShoppingCartRepository.deleteById(id);
    }
}
