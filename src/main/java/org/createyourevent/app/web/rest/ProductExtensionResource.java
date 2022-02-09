package org.createyourevent.app.web.rest;

import java.util.List;

import org.createyourevent.app.domain.Product;
import org.createyourevent.app.service.ProductExtensionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing the products.
 */
@RestController
@RequestMapping("/api")
public class ProductExtensionResource {

    private final Logger log = LoggerFactory.getLogger(ProductExtensionResource.class);

    ProductExtensionService productExtensionService;

    public ProductExtensionResource(ProductExtensionService productExtensionService) {
        this.productExtensionService = productExtensionService;
    }

    @GetMapping("/products/{shopId}/all")
    public List<Product> getProductsFromShop(@PathVariable Long shopId) {
        log.debug("REST request to get Products from Shop");
        List<Product> products = productExtensionService.findAllByShopId(shopId);
        return products;
    }


    @GetMapping("/products/{shopId}/active")
    public List<Product> getProductsFromShopAndActive(@PathVariable Long shopId) {
        log.debug("REST request to get Products from Shop where active=true");
        List<Product> products = productExtensionService.findAllByShopIdAndActiveTrue(shopId);
        return products;
    }

    @GetMapping("/products/shop/product/active")
    public List<Product> getProductsFromShopActiveAndActive() {
        log.debug("REST List<Product> getProductsFromShopActiveAndActive()");
        List<Product> products = productExtensionService.findAllByShopActiveAndActiveTrue();
        return products;
    }
}
