package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceComment;
import org.createyourevent.app.repository.ServiceCommentRepository;
import org.createyourevent.app.service.ServiceCommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ServiceComment}.
 */
@Service
@Transactional
public class ServiceCommentServiceImpl implements ServiceCommentService {

    private final Logger log = LoggerFactory.getLogger(ServiceCommentServiceImpl.class);

    private final ServiceCommentRepository serviceCommentRepository;

    public ServiceCommentServiceImpl(ServiceCommentRepository serviceCommentRepository) {
        this.serviceCommentRepository = serviceCommentRepository;
    }

    @Override
    public ServiceComment save(ServiceComment serviceComment) {
        log.debug("Request to save ServiceComment : {}", serviceComment);
        return serviceCommentRepository.save(serviceComment);
    }

    @Override
    public Optional<ServiceComment> partialUpdate(ServiceComment serviceComment) {
        log.debug("Request to partially update ServiceComment : {}", serviceComment);

        return serviceCommentRepository
            .findById(serviceComment.getId())
            .map(existingServiceComment -> {
                if (serviceComment.getComment() != null) {
                    existingServiceComment.setComment(serviceComment.getComment());
                }
                if (serviceComment.getDate() != null) {
                    existingServiceComment.setDate(serviceComment.getDate());
                }

                return existingServiceComment;
            })
            .map(serviceCommentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceComment> findAll(Pageable pageable) {
        log.debug("Request to get all ServiceComments");
        return serviceCommentRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ServiceComment> findOne(Long id) {
        log.debug("Request to get ServiceComment : {}", id);
        return serviceCommentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ServiceComment : {}", id);
        serviceCommentRepository.deleteById(id);
    }
}
