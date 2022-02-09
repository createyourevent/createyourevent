package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceLikeDislike;
import org.createyourevent.app.repository.ServiceLikeDislikeRepository;
import org.createyourevent.app.service.ServiceLikeDislikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ServiceLikeDislike}.
 */
@Service
@Transactional
public class ServiceLikeDislikeServiceImpl implements ServiceLikeDislikeService {

    private final Logger log = LoggerFactory.getLogger(ServiceLikeDislikeServiceImpl.class);

    private final ServiceLikeDislikeRepository serviceLikeDislikeRepository;

    public ServiceLikeDislikeServiceImpl(ServiceLikeDislikeRepository serviceLikeDislikeRepository) {
        this.serviceLikeDislikeRepository = serviceLikeDislikeRepository;
    }

    @Override
    public ServiceLikeDislike save(ServiceLikeDislike serviceLikeDislike) {
        log.debug("Request to save ServiceLikeDislike : {}", serviceLikeDislike);
        return serviceLikeDislikeRepository.save(serviceLikeDislike);
    }

    @Override
    public Optional<ServiceLikeDislike> partialUpdate(ServiceLikeDislike serviceLikeDislike) {
        log.debug("Request to partially update ServiceLikeDislike : {}", serviceLikeDislike);

        return serviceLikeDislikeRepository
            .findById(serviceLikeDislike.getId())
            .map(existingServiceLikeDislike -> {
                if (serviceLikeDislike.getLike() != null) {
                    existingServiceLikeDislike.setLike(serviceLikeDislike.getLike());
                }
                if (serviceLikeDislike.getDislike() != null) {
                    existingServiceLikeDislike.setDislike(serviceLikeDislike.getDislike());
                }
                if (serviceLikeDislike.getDate() != null) {
                    existingServiceLikeDislike.setDate(serviceLikeDislike.getDate());
                }
                if (serviceLikeDislike.getComment() != null) {
                    existingServiceLikeDislike.setComment(serviceLikeDislike.getComment());
                }

                return existingServiceLikeDislike;
            })
            .map(serviceLikeDislikeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceLikeDislike> findAll(Pageable pageable) {
        log.debug("Request to get all ServiceLikeDislikes");
        return serviceLikeDislikeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ServiceLikeDislike> findOne(Long id) {
        log.debug("Request to get ServiceLikeDislike : {}", id);
        return serviceLikeDislikeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ServiceLikeDislike : {}", id);
        serviceLikeDislikeRepository.deleteById(id);
    }
}
