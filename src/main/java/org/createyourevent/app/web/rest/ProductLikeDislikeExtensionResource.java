package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ProductLikeDislike;
import org.createyourevent.app.service.ProductLikeDislikeExtensionService;
import org.createyourevent.app.service.ProductLikeDislikeService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;

import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.ProductLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class ProductLikeDislikeExtensionResource {

    private final Logger log = LoggerFactory.getLogger(ProductLikeDislikeExtensionResource.class);

    private static final String ENTITY_NAME = "productLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductLikeDislikeExtensionService productLikeDislikeExtensionService;

    public ProductLikeDislikeExtensionResource(ProductLikeDislikeExtensionService productLikeDislikeExtensionService) {
        this.productLikeDislikeExtensionService = productLikeDislikeExtensionService;
    }


    @GetMapping("/product-like-dislikes/{productId}/getProductLikeDislikeByProductId")
    public List<ProductLikeDislike> getProductLikeDislikeByProductId(@PathVariable Long productId) {
        log.debug("REST request to get ProductLikeDislike by Product ID : {}", productId);
        List<ProductLikeDislike> productLikeDislikes = productLikeDislikeExtensionService.findAllByProductId(productId);
        return productLikeDislikes;
    }

    @GetMapping("/product-like-dislikes/{productId}/{userId}/getProductLikeDislikeByProductIdAndUserId")
    public List<ProductLikeDislike> getProductLikeDislikeByProductIdAndUserId(@PathVariable Long productId, @PathVariable String userId) {
        log.debug("REST request to get ProductLikeDislike by Product ID and User ID");
        List<ProductLikeDislike> productLikeDislikes = productLikeDislikeExtensionService.findAllByProductIdAndUserId(productId, userId);
        return productLikeDislikes;
    }
}
