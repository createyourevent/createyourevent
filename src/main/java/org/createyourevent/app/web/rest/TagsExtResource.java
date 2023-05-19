package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Tags;
import org.createyourevent.app.service.TagsExtService;
import org.createyourevent.app.service.TagsExtServiceCustom;
import org.createyourevent.app.service.TagsService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourevent.domain.Tags}.
 */
@RestController
@RequestMapping("/api")
public class TagsExtResource {

    private final Logger log = LoggerFactory.getLogger(TagsExtResource.class);

    private static final String ENTITY_NAME = "tags";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TagsExtService tagsExtService;

    private final TagsExtServiceCustom tagsExtServiceCustom;

    public TagsExtResource(TagsExtService tagsExtService, TagsExtServiceCustom tagsExtServiceCustom) {
        this.tagsExtService = tagsExtService;
        this.tagsExtServiceCustom = tagsExtServiceCustom;
    }

    @DeleteMapping("/tags/deleteProduct/{productId}")
    public void deleteTagsbyProductId(@PathVariable Long productId) {
        tagsExtService.deleteByProductId(productId);
    }

    @DeleteMapping("/tags/deleteEvent/{eventId}")
    public void deleteTagsbyEventId(@PathVariable Long eventId) {
        tagsExtService.deleteByEventId(eventId);
    }

    @DeleteMapping("/tags/deleteService/{serviceId}")
    public void deleteTagsbyServiceId(@PathVariable Long serviceId) {
        tagsExtService.deleteByCreateYourEventServiceId(serviceId);
    }

    @DeleteMapping("/tags/deleteShop/{shopId}")
    public void deleteTagsbyShopId(@PathVariable Long shopId) {
        tagsExtService.deleteByShopId(shopId);
    }

    @DeleteMapping("/tags/deleteOrganization/{organizationId}")
    public void deleteTagsbyOrganizationId(@PathVariable Long organizationId) {
        tagsExtService.deleteByOrganizationId(organizationId);
    }

    @GetMapping("/tags/findProduct/{productId}")
    public List<Tags> findTagsbyProductId(@PathVariable Long productId) {
        return tagsExtService.findByProductId(productId);
    }

    @GetMapping("/tags/findEvent/{eventId}")
    public List<Tags> findTagsbyEventId(@PathVariable Long eventId) {
        return tagsExtService.findByEventId(eventId);
    }

    @GetMapping("/tags/findService/{serviceId}")
    public List<Tags> findTagsbyServiceId(@PathVariable Long serviceId) {
        return tagsExtService.findByServiceId(serviceId);
    }

    @GetMapping("/tags/findShop/{shopId}")
    public List<Tags> findTagsbyShopId(@PathVariable Long shopId) {
        return tagsExtService.findByShopId(shopId);
    }

    @GetMapping("/tags/findOrganization/{organizationId}")
    public List<Tags> findTagsbyOrganizationId(@PathVariable Long organizationId) {
        return tagsExtService.findByOrganizationId(organizationId);
    }

    @GetMapping("/tags/all")
    public List<Tags> findAllTags() {
        return tagsExtService.findAll();
    }

    @GetMapping("/tags/50")
    public List<Tags> find50TagsRandomly() {
        return tagsExtServiceCustom.find50Item();
    }

    @GetMapping("/tags/50event")
    public List<Tags> find50EventTagsRandomly() {
        return tagsExtServiceCustom.find50EventItem();
    }

    @GetMapping("/tags/active/all")
    public List<Tags> findAllTagsWidthActiveTrue() {
        return tagsExtServiceCustom.findAllTagsWithActiveTrue();
    }
}
