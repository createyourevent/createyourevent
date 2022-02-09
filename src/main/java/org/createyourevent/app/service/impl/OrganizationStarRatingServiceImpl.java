package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.OrganizationStarRating;
import org.createyourevent.app.repository.OrganizationStarRatingRepository;
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
public class OrganizationStarRatingServiceImpl implements OrganizationStarRatingService {

    private final Logger log = LoggerFactory.getLogger(OrganizationStarRatingServiceImpl.class);

    private final OrganizationStarRatingRepository organizationStarRatingRepository;

    public OrganizationStarRatingServiceImpl(OrganizationStarRatingRepository organizationStarRatingRepository) {
        this.organizationStarRatingRepository = organizationStarRatingRepository;
    }

    @Override
    public OrganizationStarRating save(OrganizationStarRating organizationStarRating) {
        log.debug("Request to save OrganizationStarRating : {}", organizationStarRating);
        return organizationStarRatingRepository.save(organizationStarRating);
    }

    @Override
    public Optional<OrganizationStarRating> partialUpdate(OrganizationStarRating organizationStarRating) {
        log.debug("Request to partially update OrganizationStarRating : {}", organizationStarRating);

        return organizationStarRatingRepository
            .findById(organizationStarRating.getId())
            .map(existingOrganizationStarRating -> {
                if (organizationStarRating.getStars() != null) {
                    existingOrganizationStarRating.setStars(organizationStarRating.getStars());
                }
                if (organizationStarRating.getDate() != null) {
                    existingOrganizationStarRating.setDate(organizationStarRating.getDate());
                }
                if (organizationStarRating.getComment() != null) {
                    existingOrganizationStarRating.setComment(organizationStarRating.getComment());
                }

                return existingOrganizationStarRating;
            })
            .map(organizationStarRatingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrganizationStarRating> findAll(Pageable pageable) {
        log.debug("Request to get all OrganizationStarRatings");
        return organizationStarRatingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrganizationStarRating> findOne(Long id) {
        log.debug("Request to get OrganizationStarRating : {}", id);
        return organizationStarRatingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete OrganizationStarRating : {}", id);
        organizationStarRatingRepository.deleteById(id);
    }
}
