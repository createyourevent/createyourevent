package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationStarRating;
import org.createyourevent.app.repository.OrganizationStarRatingExtRepository;
import org.createyourevent.app.repository.OrganizationStarRatingRepository;
import org.createyourevent.app.service.OrganizationStarRatingExtService;
import org.createyourevent.app.service.OrganizationStarRatingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link OrganizationStarRating}.
 */
@Service
@Transactional
public class OrganizationStarRatingExtServiceImpl implements OrganizationStarRatingExtService {

    private final Logger log = LoggerFactory.getLogger(OrganizationStarRatingExtServiceImpl.class);

    private final OrganizationStarRatingExtRepository organizationStarRatingExtRepository;

    public OrganizationStarRatingExtServiceImpl(OrganizationStarRatingExtRepository organizationStarRatingExtRepository) {
        this.organizationStarRatingExtRepository = organizationStarRatingExtRepository;
    }

    @Override
    public List<OrganizationStarRating> findByOrganizationId(Long organizationId) {
        return this.organizationStarRatingExtRepository.findByOrganizationId(organizationId);
    }

    @Override
    public OrganizationStarRating findByOrganizationIdAndUserId(Long organizationId, String userId) {
        return this.organizationStarRatingExtRepository.findByOrganizationIdAndUserId(organizationId, userId);
    }


}
