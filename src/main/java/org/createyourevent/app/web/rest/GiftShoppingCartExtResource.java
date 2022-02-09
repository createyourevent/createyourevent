package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.GiftShoppingCart;
import org.createyourevent.app.service.GiftShoppingCartExtService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing {@link org.createyourevent.domain.GiftShoppingCart}.
 */
@RestController
@RequestMapping("/api")
public class GiftShoppingCartExtResource {

    private final Logger log = LoggerFactory.getLogger(GiftShoppingCartExtResource.class);

    private static final String ENTITY_NAME = "giftShoppingCart";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GiftShoppingCartExtService giftShoppingCartExtService;

    public GiftShoppingCartExtResource(GiftShoppingCartExtService giftShoppingCartExtService) {
        this.giftShoppingCartExtService = giftShoppingCartExtService;
    }

    /**
     * {@code GET  /gift-shopping-carts/:id} : get the "id" giftShoppingCart.
     *
     * @param id the id of the giftShoppingCart to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the giftShoppingCart, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/gift-shopping-carts/{userId}/findByUserId")
    public List<GiftShoppingCart> findByUserId(@PathVariable String userId) {
        log.debug("List<GiftShoppingCart> findByUserId(@PathVariable String userId)");
        List<GiftShoppingCart> giftShoppingCarts = giftShoppingCartExtService.findByUserId(userId);
        return giftShoppingCarts;
    }
}
