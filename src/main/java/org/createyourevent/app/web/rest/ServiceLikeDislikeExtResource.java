package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ServiceLikeDislike;
import org.createyourevent.app.service.ServiceLikeDislikeExtService;
import org.createyourevent.app.service.ServiceLikeDislikeService;
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
 * REST controller for managing {@link org.createyourevent.domain.ServiceLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class ServiceLikeDislikeExtResource {

    private final Logger log = LoggerFactory.getLogger(ServiceLikeDislikeExtResource.class);

    private static final String ENTITY_NAME = "serviceLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceLikeDislikeExtService serviceLikeDislikeExtService;

    public ServiceLikeDislikeExtResource(ServiceLikeDislikeExtService serviceLikeDislikeExtService) {
        this.serviceLikeDislikeExtService = serviceLikeDislikeExtService;
    }

    @GetMapping("/service-like-dislikes/{serviceId}/getServiceLikeDislikeByServiceId")
    public List<ServiceLikeDislike> getServiceLikeDislikeByServiceId(@PathVariable Long serviceId) {
        log.debug("REST request to get ServiceLikeDislike by Service ID : {}", serviceId);
        List<ServiceLikeDislike> serviceLikeDislikes = serviceLikeDislikeExtService.findAllByServiceId(serviceId);
        return serviceLikeDislikes;
    }

    @GetMapping("/service-like-dislikes/{serviceId}/{userId}/getServiceLikeDislikeByServiceIdAndUserId")
    public List<ServiceLikeDislike> getServiceLikeDislikeByServiceIdAndUserId(@PathVariable Long serviceId, @PathVariable String userId) {
        log.debug("REST request to get ServiceLikeDislike by Service ID and User ID");
        List<ServiceLikeDislike> serviceLikeDislikes = serviceLikeDislikeExtService.findAllByServiceIdAndUserId(serviceId, userId);
        return serviceLikeDislikes;
    }

}
