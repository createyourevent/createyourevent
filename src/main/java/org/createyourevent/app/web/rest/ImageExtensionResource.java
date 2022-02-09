package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.Image;
import org.createyourevent.app.service.ImageExtensionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * REST controller for managing {@link org.createyourevent.domain.Image}.
 */
@RestController
@RequestMapping("/api")
public class ImageExtensionResource {

    private final Logger log = LoggerFactory.getLogger(ImageExtensionResource.class);

    private static final String ENTITY_NAME = "image";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ImageExtensionService imageExtensionService;

    public ImageExtensionResource(ImageExtensionService imageExtensionService) {
        this.imageExtensionService = imageExtensionService;
    }


    @GetMapping("/images/{productId}/imagesFromProductId")
    public List<Image> getImagesFromProductId(@PathVariable Long productId) {
        log.debug("REST request to get Images with ProductId:" + productId);
        List<Image> images = imageExtensionService.findAllByProductId(productId);
        return images;
    }


    @GetMapping("/images/{productId}/{userId}/imagesFromProductIdAndUserId")
    public List<Image> getImagesFromProductIdAndUserId(@PathVariable Long productId, @PathVariable String userId) {
        log.debug("REST request to get Images with ProductId:" + productId + "and UserId:" + userId);
        List<Image> images = imageExtensionService.findAllByProductIdAndUserId(productId, userId);
        return images;
    }

    @GetMapping("/images/{shopId}/imagesFromShopId")
    public List<Image> getImagesFromShopId(@PathVariable Long shopId) {
        log.debug("REST request to get Images with ShopId:" + shopId);
        List<Image> images = imageExtensionService.findAllByShopId(shopId);
        return images;
    }


    @GetMapping("/images/{shopId}/{userId}/imagesFromShopIdAndUserId")
    public List<Image> getImagesFromShopIdAndUserId(@PathVariable Long shopId, @PathVariable String userId) {
        log.debug("REST request to get Images with ShopId:" + shopId + "and UserId:" + userId);
        List<Image> images = imageExtensionService.findAllByShopIdAndUserId(shopId, userId);
        return images;
    }

    @GetMapping("/images/{eventId}/imagesFromEventId")
    public List<Image> getImagesFromEventId(@PathVariable Long eventId) {
        log.debug("REST request to get Images with EventId:" + eventId);
        List<Image> images = imageExtensionService.findAllByEventId(eventId);
        return images;
    }


    @GetMapping("/images/{eventId}/{userId}/imagesFromEventIdAndUserId")
    public List<Image> getImagesFromEventIdAndUserId(@PathVariable Long eventId, @PathVariable String userId) {
        log.debug("REST request to get Images with ShopId:" + eventId + "and UserId:" + userId);
        List<Image> images = imageExtensionService.findAllByEventIdAndUserId(eventId, userId);
        return images;
    }

    @GetMapping("/images/{serviceId}/imagesFromServiceId")
    public List<Image> getImagesFromServiceId(@PathVariable Long serviceId) {
        log.debug("REST request to get Images with ServiceId:" + serviceId);
        List<Image> images = imageExtensionService.findAllByServiceId(serviceId);
        return images;
    }


    @GetMapping("/images/{serviceId}/{userId}/imagesFromServiceIdAndUserId")
    public List<Image> getImagesFromServiceIdAndUserId(@PathVariable Long serviceId, @PathVariable String userId) {
        log.debug("REST request to get Images with ServiceId:" + serviceId + "and UserId:" + userId);
        List<Image> images = imageExtensionService.findAllByShopIdAndUserId(serviceId, userId);
        return images;
    }

    @GetMapping("/images/{organizationId}/imagesFromOrganizationId")
    public List<Image> getImagesFromOrganizationId(@PathVariable Long organizationId) {
        log.debug("REST request to get Images with OrganizationId:" + organizationId);
        List<Image> images = imageExtensionService.findAllByOrganizationId(organizationId);
        return images;
    }


    @GetMapping("/images/{organizationId}/{userId}/imagesFromOrganizationIdAndUserId")
    public List<Image> getImagesFromOrganizationIdAndUserId(@PathVariable Long organizationId, @PathVariable String userId) {
        log.debug("REST request to get Images with OrganizationId:" + organizationId + "and UserId:" + userId);
        List<Image> images = imageExtensionService.findAllByOrganizationIdAndUserId(organizationId, userId);
        return images;
    }
}
