package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ShopComment;
import org.createyourevent.app.service.ShopCommentExtensionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.bind.annotation.*;


import java.util.List;

/**
 * REST controller for managing {@link org.createyourevent.domain.ShopComment}.
 */
@RestController
@RequestMapping("/api")
public class ShopCommentExtensionResource {

    private final Logger log = LoggerFactory.getLogger(ShopCommentExtensionResource.class);

    private static final String ENTITY_NAME = "shopComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShopCommentExtensionService shopCommentExtensionService;

    public ShopCommentExtensionResource(ShopCommentExtensionService shopCommentExtensionService) {
        this.shopCommentExtensionService = shopCommentExtensionService;
    }

    @GetMapping("/shop-comments/{shopId}/getShopCommentByShopId")
    public List<ShopComment> getShopCommentByShopId(@PathVariable Long shopId) {
        log.debug("REST request to get ShopComment by Shop ID");
        List<ShopComment> shopComments = shopCommentExtensionService.findAllByShopId(shopId);
        return shopComments;
    }

    @GetMapping("/shop-comments/{shopId}/{userId}/getShopCommentByShopIdAndUserId")
    public List<ShopComment> getShopCommentByShopIdAndUserId(@PathVariable Long shopId, @PathVariable String userId) {
        log.debug("REST request to get ShopComment by Shop ID and User ID");
        List<ShopComment> shopComments = shopCommentExtensionService.findAllByShopIdAndUserId(shopId, userId);
        return shopComments;
    }

    @PostMapping("/shop-comments/findAllByEager")
    public List<ShopComment> findAllByEager() {
        log.debug("REST request to get all ShopComment by eager");
        List<ShopComment> sc =  shopCommentExtensionService.findAll();
        return sc;
    }
}
