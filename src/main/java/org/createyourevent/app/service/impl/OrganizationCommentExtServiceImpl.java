package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationComment;
import org.createyourevent.app.repository.OrganizationCommentExtRepository;
import org.createyourevent.app.repository.OrganizationCommentRepository;
import org.createyourevent.app.service.OrganizationCommentExtService;
import org.createyourevent.app.service.OrganizationCommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link OrganizationComment}.
 */
@Service
@Transactional
public class OrganizationCommentExtServiceImpl implements OrganizationCommentExtService {

    private final Logger log = LoggerFactory.getLogger(OrganizationCommentExtServiceImpl.class);

    private final OrganizationCommentExtRepository organizationCommentExtRepository;

    public OrganizationCommentExtServiceImpl(OrganizationCommentExtRepository organizationCommentExtRepository) {
        this.organizationCommentExtRepository = organizationCommentExtRepository;
    }

    @Override
    public List<OrganizationComment> findAllByOrganizationId(Long organizationId) {
        return this.organizationCommentExtRepository.findAllByOrganizationId(organizationId);
    }

    @Override
    public List<OrganizationComment> findAllByOrganizationIdAndUserId(Long organizationId, String userId) {
        return this.organizationCommentExtRepository.findAllByOrganizationIdAndUserId(organizationId, userId);
    }

}
