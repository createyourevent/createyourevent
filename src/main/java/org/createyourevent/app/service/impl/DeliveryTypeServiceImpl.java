package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.DeliveryType;
import org.createyourevent.app.repository.DeliveryTypeRepository;
import org.createyourevent.app.service.DeliveryTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link DeliveryType}.
 */
@Service
@Transactional
public class DeliveryTypeServiceImpl implements DeliveryTypeService {

    private final Logger log = LoggerFactory.getLogger(DeliveryTypeServiceImpl.class);

    private final DeliveryTypeRepository deliveryTypeRepository;

    public DeliveryTypeServiceImpl(DeliveryTypeRepository deliveryTypeRepository) {
        this.deliveryTypeRepository = deliveryTypeRepository;
    }

    @Override
    public DeliveryType save(DeliveryType deliveryType) {
        log.debug("Request to save DeliveryType : {}", deliveryType);
        return deliveryTypeRepository.save(deliveryType);
    }

    @Override
    public Optional<DeliveryType> partialUpdate(DeliveryType deliveryType) {
        log.debug("Request to partially update DeliveryType : {}", deliveryType);

        return deliveryTypeRepository
            .findById(deliveryType.getId())
            .map(existingDeliveryType -> {
                if (deliveryType.getDeliveryType() != null) {
                    existingDeliveryType.setDeliveryType(deliveryType.getDeliveryType());
                }
                if (deliveryType.getMinimumOrderQuantity() != null) {
                    existingDeliveryType.setMinimumOrderQuantity(deliveryType.getMinimumOrderQuantity());
                }
                if (deliveryType.getPrice() != null) {
                    existingDeliveryType.setPrice(deliveryType.getPrice());
                }
                if (deliveryType.getPricePerKilometre() != null) {
                    existingDeliveryType.setPricePerKilometre(deliveryType.getPricePerKilometre());
                }

                return existingDeliveryType;
            })
            .map(deliveryTypeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DeliveryType> findAll(Pageable pageable) {
        log.debug("Request to get all DeliveryTypes");
        return deliveryTypeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DeliveryType> findOne(Long id) {
        log.debug("Request to get DeliveryType : {}", id);
        return deliveryTypeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete DeliveryType : {}", id);
        deliveryTypeRepository.deleteById(id);
    }
}
