package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ProductComment;
import org.createyourevent.app.service.ProductCommentExtensionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing {@link org.createyourevent.domain.ProductComment}.
 */
@RestController
@RequestMapping("/api")
public class ProductCommentExtensionResource {

    private final Logger log = LoggerFactory.getLogger(ProductCommentExtensionResource.class);

    private static final String ENTITY_NAME = "productComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductCommentExtensionService productCommentExtensionService;

    public ProductCommentExtensionResource(ProductCommentExtensionService productCommentExtensionService) {
        this.productCommentExtensionService = productCommentExtensionService;
    }


    @GetMapping("/product-comments/{productId}/getProductCommentByProductId")
    public List<ProductComment> getProductCommentByProductId(@PathVariable Long productId) {
        log.debug("REST request to get ProductComment by Product ID");
        List<ProductComment> productComments = productCommentExtensionService.findAllByProductId(productId);
        return productComments;
    }

    @GetMapping("/product-comments/{productId}/{userId}/getProductCommentByProductIdAndUserId")
    public List<ProductComment> getProductCommentByProductIdAndUserId(@PathVariable Long productId, @PathVariable String userId) {
        log.debug("REST request to get ProductComment by Product ID and User ID");
        List<ProductComment> productComments = productCommentExtensionService.findAllByProductIdAndUserId(productId, userId);
        return productComments;
    }
}
