package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.DeliveryTypeExtService;
import org.createyourevent.app.domain.DeliveryType;
import org.createyourevent.app.repository.DeliveryTypeExtRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing {@link DeliveryType}.
 */
@Service
@Transactional
public class DeliveryTypeExtServiceImpl implements DeliveryTypeExtService {

    private final Logger log = LoggerFactory.getLogger(DeliveryTypeExtServiceImpl.class);

    private final DeliveryTypeExtRepository deliveryTypeExtRepository;

    public DeliveryTypeExtServiceImpl(DeliveryTypeExtRepository deliveryTypeExtRepository) {
        this.deliveryTypeExtRepository = deliveryTypeExtRepository;
    }

    @Override
    public List<DeliveryType> findDeliveryTypeByProductId(Long productId) {
        log.debug("List<DeliveryType> findDeliveryTypeByEventId(Long eventId)");
        List<DeliveryType> l = deliveryTypeExtRepository.findByProductId(productId);
        return l;
    }

    @Override
    @Transactional
    public void deleteDeliveryTypeByProductId(Long productId) {
        deliveryTypeExtRepository.deleteByProductId(productId);
    }


}
