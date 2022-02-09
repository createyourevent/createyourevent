package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationLikeDislike;
import org.createyourevent.app.repository.OrganizationLikeDislikeExtRepository;
import org.createyourevent.app.repository.OrganizationLikeDislikeRepository;
import org.createyourevent.app.service.OrganizationLikeDislikeExtService;
import org.createyourevent.app.service.OrganizationLikeDislikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link OrganizationLikeDislike}.
 */
@Service
@Transactional
public class OrganizationLikeDislikeExtServiceImpl implements OrganizationLikeDislikeExtService {

    private final Logger log = LoggerFactory.getLogger(OrganizationLikeDislikeExtServiceImpl.class);

    private final OrganizationLikeDislikeExtRepository organizationLikeDislikeExtRepository;

    public OrganizationLikeDislikeExtServiceImpl(OrganizationLikeDislikeExtRepository organizationLikeDislikeExtRepository) {
        this.organizationLikeDislikeExtRepository = organizationLikeDislikeExtRepository;
    }

    @Override
    public List<OrganizationLikeDislike> findAllByOrganizationId(Long organizationId) {
        return organizationLikeDislikeExtRepository.findAllByOrganizationId(organizationId);
    }

    @Override
    public List<OrganizationLikeDislike> findAllByOrganizationIdAndUserId(Long organizationId, String userId) {
        return organizationLikeDislikeExtRepository.findAllByOrganizationIdAndUserId(organizationId, userId);
    }
}
