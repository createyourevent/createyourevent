package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.OrganizationComment;
import org.createyourevent.app.repository.OrganizationCommentRepository;
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
public class OrganizationCommentServiceImpl implements OrganizationCommentService {

    private final Logger log = LoggerFactory.getLogger(OrganizationCommentServiceImpl.class);

    private final OrganizationCommentRepository organizationCommentRepository;

    public OrganizationCommentServiceImpl(OrganizationCommentRepository organizationCommentRepository) {
        this.organizationCommentRepository = organizationCommentRepository;
    }

    @Override
    public OrganizationComment save(OrganizationComment organizationComment) {
        log.debug("Request to save OrganizationComment : {}", organizationComment);
        return organizationCommentRepository.save(organizationComment);
    }

    @Override
    public Optional<OrganizationComment> partialUpdate(OrganizationComment organizationComment) {
        log.debug("Request to partially update OrganizationComment : {}", organizationComment);

        return organizationCommentRepository
            .findById(organizationComment.getId())
            .map(existingOrganizationComment -> {
                if (organizationComment.getComment() != null) {
                    existingOrganizationComment.setComment(organizationComment.getComment());
                }
                if (organizationComment.getDate() != null) {
                    existingOrganizationComment.setDate(organizationComment.getDate());
                }

                return existingOrganizationComment;
            })
            .map(organizationCommentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrganizationComment> findAll(Pageable pageable) {
        log.debug("Request to get all OrganizationComments");
        return organizationCommentRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrganizationComment> findOne(Long id) {
        log.debug("Request to get OrganizationComment : {}", id);
        return organizationCommentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete OrganizationComment : {}", id);
        organizationCommentRepository.deleteById(id);
    }
}
