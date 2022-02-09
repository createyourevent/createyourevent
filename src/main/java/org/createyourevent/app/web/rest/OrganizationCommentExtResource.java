package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationComment;
import org.createyourevent.app.repository.OrganizationCommentExtRepository;
import org.createyourevent.app.repository.OrganizationCommentRepository;
import org.createyourevent.app.service.OrganizationCommentExtService;
import org.createyourevent.app.service.OrganizationCommentService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.OrganizationComment}.
 */
@RestController
@RequestMapping("/api")
public class OrganizationCommentExtResource {

    private final Logger log = LoggerFactory.getLogger(OrganizationCommentExtResource.class);

    private static final String ENTITY_NAME = "organizationComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizationCommentExtService organizationCommentExtService;

    private final OrganizationCommentExtRepository organizationCommentExtRepository;

    public OrganizationCommentExtResource(
        OrganizationCommentExtService organizationCommentExtService,
        OrganizationCommentExtRepository organizationCommentExtRepository
    ) {
        this.organizationCommentExtService = organizationCommentExtService;
        this.organizationCommentExtRepository = organizationCommentExtRepository;
    }

    @GetMapping("/organization-comments/{organizationId}/{userId}/getOrganizationCommentByOrganizationIdAndUserId")
    public List<OrganizationComment> getOrganizationCommentByOrganizationIdAndUserId(@PathVariable Long organizationId, @PathVariable String userId) {
        log.debug("REST request to get OrganizationComment by Organization ID and User ID");
        List<OrganizationComment> organizationComments = organizationCommentExtService.findAllByOrganizationIdAndUserId(organizationId, userId);
        return organizationComments;
    }

    @GetMapping("/organization-comments/{organizationId}/getOrganizationCommentByOrganizationId")
    public List<OrganizationComment> getOrganizationCommentByOrganizationId(@PathVariable Long organizationId) {
        log.debug("REST request to get OrganizationComment by Organization ID");
        List<OrganizationComment> organizationComments = organizationCommentExtService.findAllByOrganizationId(organizationId);
        return organizationComments;
    }
}
