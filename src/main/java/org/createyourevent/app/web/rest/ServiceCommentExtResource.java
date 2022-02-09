package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ServiceComment;
import org.createyourevent.app.service.ServiceCommentExtService;
import org.createyourevent.app.service.ServiceCommentService;
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
 * REST controller for managing {@link org.createyourevent.domain.ServiceComment}.
 */
@RestController
@RequestMapping("/api")
public class ServiceCommentExtResource {

    private final Logger log = LoggerFactory.getLogger(ServiceCommentExtResource.class);

    private static final String ENTITY_NAME = "serviceComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceCommentExtService serviceCommentExtService;

    public ServiceCommentExtResource(ServiceCommentExtService serviceCommentExtService) {
        this.serviceCommentExtService = serviceCommentExtService;
    }

    @GetMapping("/service-comments/{serviceId}/getServiceCommentByServiceId")
    public List<ServiceComment> getServiceCommentByServiceId(@PathVariable Long serviceId) {
        log.debug("REST request to get ServiceComment by Service ID");
        List<ServiceComment> serviceComments = serviceCommentExtService.findAllByServiceId(serviceId);
        return serviceComments;
    }

    @GetMapping("/service-comments/{serviceId}/{userId}/getServiceCommentByServiceIdAndUserId")
    public List<ServiceComment> getServiceCommentByServiceIdAndUserId(@PathVariable Long serviceId, @PathVariable String userId) {
        log.debug("REST request to get ServiceComment by Service ID and User ID");
        List<ServiceComment> serviceComments = serviceCommentExtService.findAllByServiceIdAndUserId(serviceId, userId);
        return serviceComments;
    }

}
