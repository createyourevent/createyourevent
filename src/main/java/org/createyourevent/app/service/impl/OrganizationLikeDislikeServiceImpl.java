package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.OrganizationLikeDislike;
import org.createyourevent.app.repository.OrganizationLikeDislikeRepository;
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
public class OrganizationLikeDislikeServiceImpl implements OrganizationLikeDislikeService {

    private final Logger log = LoggerFactory.getLogger(OrganizationLikeDislikeServiceImpl.class);

    private final OrganizationLikeDislikeRepository organizationLikeDislikeRepository;

    public OrganizationLikeDislikeServiceImpl(OrganizationLikeDislikeRepository organizationLikeDislikeRepository) {
        this.organizationLikeDislikeRepository = organizationLikeDislikeRepository;
    }

    @Override
    public OrganizationLikeDislike save(OrganizationLikeDislike organizationLikeDislike) {
        log.debug("Request to save OrganizationLikeDislike : {}", organizationLikeDislike);
        return organizationLikeDislikeRepository.save(organizationLikeDislike);
    }

    @Override
    public Optional<OrganizationLikeDislike> partialUpdate(OrganizationLikeDislike organizationLikeDislike) {
        log.debug("Request to partially update OrganizationLikeDislike : {}", organizationLikeDislike);

        return organizationLikeDislikeRepository
            .findById(organizationLikeDislike.getId())
            .map(existingOrganizationLikeDislike -> {
                if (organizationLikeDislike.getLike() != null) {
                    existingOrganizationLikeDislike.setLike(organizationLikeDislike.getLike());
                }
                if (organizationLikeDislike.getDislike() != null) {
                    existingOrganizationLikeDislike.setDislike(organizationLikeDislike.getDislike());
                }
                if (organizationLikeDislike.getDate() != null) {
                    existingOrganizationLikeDislike.setDate(organizationLikeDislike.getDate());
                }
                if (organizationLikeDislike.getComment() != null) {
                    existingOrganizationLikeDislike.setComment(organizationLikeDislike.getComment());
                }

                return existingOrganizationLikeDislike;
            })
            .map(organizationLikeDislikeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrganizationLikeDislike> findAll(Pageable pageable) {
        log.debug("Request to get all OrganizationLikeDislikes");
        return organizationLikeDislikeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrganizationLikeDislike> findOne(Long id) {
        log.debug("Request to get OrganizationLikeDislike : {}", id);
        return organizationLikeDislikeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete OrganizationLikeDislike : {}", id);
        organizationLikeDislikeRepository.deleteById(id);
    }
}
