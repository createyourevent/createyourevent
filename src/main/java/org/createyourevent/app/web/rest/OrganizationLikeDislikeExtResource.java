package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationLikeDislike;
import org.createyourevent.app.repository.OrganizationLikeDislikeExtRepository;
import org.createyourevent.app.repository.OrganizationLikeDislikeRepository;
import org.createyourevent.app.service.OrganizationLikeDislikeExtService;
import org.createyourevent.app.service.OrganizationLikeDislikeService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.OrganizationLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class OrganizationLikeDislikeExtResource {

    private final Logger log = LoggerFactory.getLogger(OrganizationLikeDislikeExtResource.class);

    private static final String ENTITY_NAME = "organizationLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizationLikeDislikeExtService organizationLikeDislikeExtService;

    private final OrganizationLikeDislikeExtRepository organizationLikeDislikeExtRepository;

    public OrganizationLikeDislikeExtResource(
        OrganizationLikeDislikeExtService organizationLikeDislikeExtService,
        OrganizationLikeDislikeExtRepository organizationLikeDislikeExtRepository
    ) {
        this.organizationLikeDislikeExtService = organizationLikeDislikeExtService;
        this.organizationLikeDislikeExtRepository = organizationLikeDislikeExtRepository;
    }

    @GetMapping("/organization-like-dislikes/{organizationId}/getOrganizationLikeDislikeByOrganizationId")
    public List<OrganizationLikeDislike> getOrganizationLikeDislikeByOrganizationId(@PathVariable Long organizationId) {
        log.debug("REST request to get OrganizationLikeDislike by Organization ID : {}", organizationId);
        List<OrganizationLikeDislike> organizationLikeDislikes = organizationLikeDislikeExtService.findAllByOrganizationId(organizationId);
        return organizationLikeDislikes;
    }

    @GetMapping("/organization-like-dislikes/{organizationId}/{userId}/getOrganizationLikeDislikeByOrganizationIdAndUserId")
    public List<OrganizationLikeDislike> getOrganizationLikeDislikeByOrganizationIdAndUserId(@PathVariable Long organizationId, @PathVariable String userId) {
        log.debug("REST request to get OrganizationLikeDislike by Organization ID and User ID");
        List<OrganizationLikeDislike> organizationLikeDislikes = organizationLikeDislikeExtService.findAllByOrganizationIdAndUserId(organizationId, userId);
        return organizationLikeDislikes;
    }
}
