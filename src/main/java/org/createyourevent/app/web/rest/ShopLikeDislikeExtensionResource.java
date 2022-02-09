package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ShopLikeDislike;
import org.createyourevent.app.service.ShopLikeDislikeExtensionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * REST controller for managing {@link org.createyourevent.domain.ShopLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class ShopLikeDislikeExtensionResource {

    private final Logger log = LoggerFactory.getLogger(ShopLikeDislikeResource.class);

    private static final String ENTITY_NAME = "shopLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShopLikeDislikeExtensionService shopLikeDislikeExtensionService;

    public ShopLikeDislikeExtensionResource(ShopLikeDislikeExtensionService shopLikeDislikeExtensionService) {
        this.shopLikeDislikeExtensionService = shopLikeDislikeExtensionService;
    }

    @GetMapping("/shop-like-dislikes/{shopId}/getShopLikeDislikeByShopId")
    public List<ShopLikeDislike> getShopLikeDislikeByShopId(@PathVariable Long shopId) {
        log.debug("REST request to get ShopLikeDislike by Shop ID : {}", shopId);
        List<ShopLikeDislike> shopLikeDislikes = shopLikeDislikeExtensionService.findAllByShopId(shopId);
        return shopLikeDislikes;
    }

    @GetMapping("/shop-like-dislikes/{shopId}/{userId}/getShopLikeDislikeByShopIdAndUserId")
    public List<ShopLikeDislike> getShopLikeDislikeByShopIdAndUserId(@PathVariable Long shopId, @PathVariable String userId) {
        log.debug("REST request to get ShopLikeDislike by Shop ID and User ID");
        List<ShopLikeDislike> shopLikeDislikes = shopLikeDislikeExtensionService.findAllByShopIdAndUserId(shopId, userId);
        return shopLikeDislikes;
    }
}
