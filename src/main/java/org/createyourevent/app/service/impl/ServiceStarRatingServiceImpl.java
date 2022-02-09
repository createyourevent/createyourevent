package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceStarRating;
import org.createyourevent.app.repository.ServiceStarRatingRepository;
import org.createyourevent.app.service.ServiceStarRatingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ServiceStarRating}.
 */
@Service
@Transactional
public class ServiceStarRatingServiceImpl implements ServiceStarRatingService {

    private final Logger log = LoggerFactory.getLogger(ServiceStarRatingServiceImpl.class);

    private final ServiceStarRatingRepository serviceStarRatingRepository;

    public ServiceStarRatingServiceImpl(ServiceStarRatingRepository serviceStarRatingRepository) {
        this.serviceStarRatingRepository = serviceStarRatingRepository;
    }

    @Override
    public ServiceStarRating save(ServiceStarRating serviceStarRating) {
        log.debug("Request to save ServiceStarRating : {}", serviceStarRating);
        return serviceStarRatingRepository.save(serviceStarRating);
    }

    @Override
    public Optional<ServiceStarRating> partialUpdate(ServiceStarRating serviceStarRating) {
        log.debug("Request to partially update ServiceStarRating : {}", serviceStarRating);

        return serviceStarRatingRepository
            .findById(serviceStarRating.getId())
            .map(existingServiceStarRating -> {
                if (serviceStarRating.getStars() != null) {
                    existingServiceStarRating.setStars(serviceStarRating.getStars());
                }
                if (serviceStarRating.getDate() != null) {
                    existingServiceStarRating.setDate(serviceStarRating.getDate());
                }
                if (serviceStarRating.getComment() != null) {
                    existingServiceStarRating.setComment(serviceStarRating.getComment());
                }

                return existingServiceStarRating;
            })
            .map(serviceStarRatingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceStarRating> findAll(Pageable pageable) {
        log.debug("Request to get all ServiceStarRatings");
        return serviceStarRatingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ServiceStarRating> findOne(Long id) {
        log.debug("Request to get ServiceStarRating : {}", id);
        return serviceStarRatingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ServiceStarRating : {}", id);
        serviceStarRatingRepository.deleteById(id);
    }
}
