package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import org.createyourevent.app.domain.Mp3;
import org.createyourevent.app.service.Mp3ExtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.bind.annotation.*;


/**
 * REST controller for managing {@link org.createyourevent.app.domain.Mp3}.
 */
@RestController
@RequestMapping("/api")
public class Mp3ExtResource {

    private final Logger log = LoggerFactory.getLogger(Mp3ExtResource.class);

    private static final String ENTITY_NAME = "mp3";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Mp3ExtService mp3ExtService;

    public Mp3ExtResource(Mp3ExtService mp3ExtService) {
        this.mp3ExtService = mp3ExtService;
    }


    @GetMapping("/mp-3-s/{userId}/{serviceId}/service")
    public List<Mp3> findMp3ByUserIdAndServiceId(@PathVariable String userId, @PathVariable Long serviceId) {
        log.debug("REST request to get Mp3 by Service : {}");
        List<Mp3> l = mp3ExtService.findByUserIdAndServiceId(userId, serviceId);
        return l;
    }

    @GetMapping("/mp-3-s/{serviceId}/service")
    public List<Mp3> findMp3ByServiceId(@PathVariable Long serviceId) {
        log.debug("REST request to get Mp3 by Service : {}");
        List<Mp3> l = mp3ExtService.findByService(serviceId);
        return l;
    }

    @GetMapping("/mp-3-s/{userId}/{productId}/product")
    public List<Mp3> findMp3ByUserIdAndProductId(@PathVariable String userId, @PathVariable Long productId) {
        log.debug("REST request to get Mp3 by Service : {}");
        List<Mp3> l = mp3ExtService.findByUserIdAndProductId(userId, productId);
        return l;
    }

    @GetMapping("/mp-3-s/{productId}/product")
    public List<Mp3> findMp3ByProductId(@PathVariable Long productId) {
        log.debug("REST request to get Mp3 by Service : {}");
        List<Mp3> l = mp3ExtService.findByProductId(productId);
        return l;
    }

    @GetMapping("/mp-3-s/{userId}/{eventId}/event")
    public List<Mp3> findMp3ByUserIdAndEventId(@PathVariable String userId, @PathVariable Long eventId) {
        log.debug("REST request to get Mp3 by Service : {}");
        List<Mp3> l = mp3ExtService.findByUserIdAndEventId(userId, eventId);
        return l;
    }

    @GetMapping("/mp-3-s/{eventId}/event")
    public List<Mp3> findMp3ByEventId(@PathVariable Long eventId) {
        log.debug("REST request to get Mp3 by Service : {}");
        List<Mp3> l = mp3ExtService.findByEventId(eventId);
        return l;
    }

    @GetMapping("/mp-3-s/{userId}/{shopId}/shop")
    public List<Mp3> findMp3ByUserIdAndShopId(@PathVariable String userId, @PathVariable Long shopId) {
        log.debug("REST request to get Mp3 by Service : {}");
        List<Mp3> l = mp3ExtService.findByUserIdAndShopId(userId, shopId);
        return l;
    }


    @GetMapping("/mp-3-s/{shopId}/shop")
    public List<Mp3> findMp3ByShopId(@PathVariable Long shopId) {
        log.debug("REST request to get Mp3 by Service : {}");
        List<Mp3> l = mp3ExtService.findByShopId(shopId);
        return l;
    }
}
