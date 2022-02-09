package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceOffer;
import org.createyourevent.app.repository.ServiceOfferRepository;
import org.createyourevent.app.service.ServiceOfferService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ServiceOffer}.
 */
@Service
@Transactional
public class ServiceOfferServiceImpl implements ServiceOfferService {

    private final Logger log = LoggerFactory.getLogger(ServiceOfferServiceImpl.class);

    private final ServiceOfferRepository serviceOfferRepository;

    public ServiceOfferServiceImpl(ServiceOfferRepository serviceOfferRepository) {
        this.serviceOfferRepository = serviceOfferRepository;
    }

    @Override
    public ServiceOffer save(ServiceOffer serviceOffer) {
        log.debug("Request to save ServiceOffer : {}", serviceOffer);
        return serviceOfferRepository.save(serviceOffer);
    }

    @Override
    public Optional<ServiceOffer> partialUpdate(ServiceOffer serviceOffer) {
        log.debug("Request to partially update ServiceOffer : {}", serviceOffer);

        return serviceOfferRepository
            .findById(serviceOffer.getId())
            .map(existingServiceOffer -> {
                if (serviceOffer.getTitle() != null) {
                    existingServiceOffer.setTitle(serviceOffer.getTitle());
                }
                if (serviceOffer.getDescription() != null) {
                    existingServiceOffer.setDescription(serviceOffer.getDescription());
                }
                if (serviceOffer.getCostHour() != null) {
                    existingServiceOffer.setCostHour(serviceOffer.getCostHour());
                }

                return existingServiceOffer;
            })
            .map(serviceOfferRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceOffer> findAll(Pageable pageable) {
        log.debug("Request to get all ServiceOffers");
        return serviceOfferRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ServiceOffer> findOne(Long id) {
        log.debug("Request to get ServiceOffer : {}", id);
        return serviceOfferRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ServiceOffer : {}", id);
        serviceOfferRepository.deleteById(id);
    }
}
