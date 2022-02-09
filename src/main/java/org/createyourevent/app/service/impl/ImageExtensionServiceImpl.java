package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ImageExtensionService;
import org.createyourevent.app.domain.Image;
import org.createyourevent.app.repository.ImageExtensionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing {@link Image}.
 */
@Service
@Transactional
public class ImageExtensionServiceImpl implements ImageExtensionService {

    private final Logger log = LoggerFactory.getLogger(ImageServiceImpl.class);

    private final ImageExtensionRepository imageExtensionRepository;

    public ImageExtensionServiceImpl(ImageExtensionRepository imageExtensionRepository) {
        this.imageExtensionRepository = imageExtensionRepository;
    }

    @Override
    public List<Image> findAllByProductId(Long productId) {
        log.debug("findAllByProductId():" + productId);
        List<Image> i = imageExtensionRepository.findAllByProductId(productId);
        return i;
    }

    @Override
    public List<Image> findAllByProductIdAndUserId(Long productId, String userId) {
        log.debug("findAllByProductIdAndUserId():" + productId + '/' + userId);
        List<Image> i = imageExtensionRepository.findAllByProductIdAndUserId(productId, userId);
        return i;
    }

    @Override
    public List<Image> findAllByShopId(Long shopId) {
        log.debug("findAllByShopId():" + shopId);
        List<Image> i = imageExtensionRepository.findAllByShopId(shopId);
        return i;
    }

    @Override
    public List<Image> findAllByShopIdAndUserId(Long shopId, String userId) {
        log.debug("findAllByProductIdAndUserId():" + shopId + '/' + userId);
        List<Image> i = imageExtensionRepository.findAllByShopIdAndUserId(shopId, userId);
        return i;
    }

    @Override
    public List<Image> findAllByEventId(Long eventId) {
        log.debug("findAllByEventId():" + eventId);
        List<Image> i = imageExtensionRepository.findAllByEventId(eventId);
        return i;
    }

    @Override
    public List<Image> findAllByEventIdAndUserId(Long eventId, String userId) {
        log.debug("findAllByEventIdAndUserId():" + eventId + '/' + userId);
        List<Image> i = imageExtensionRepository.findAllByEventIdAndUserId(eventId, userId);
        return i;
    }

    @Override
    public List<Image> findAllByServiceId(Long serviceId) {
        log.debug("findAllByServiceId():" + serviceId);
        List<Image> i = imageExtensionRepository.findAllByServiceId(serviceId);
        return i;
    }

    @Override
    public List<Image> findAllByServiceIdAndUserId(Long serviceId, String userId) {
        log.debug("findAllByServiceIdAndUserId():" + serviceId + '/' + userId);
        List<Image> i = imageExtensionRepository.findAllByServiceIdAndUserId(serviceId, userId);
        return i;
    }

    @Override
    public List<Image> findAllByOrganizationId(Long organizationId) {
        log.debug("findAllByOrganizationId():" + organizationId);
        List<Image> i = imageExtensionRepository.findAllByOrganizationId(organizationId);
        return i;
    }

    @Override
    public List<Image> findAllByOrganizationIdAndUserId(Long organizationId, String userId) {
        log.debug("findAllByOrganizationIdAndUserId():" + organizationId + '/' + userId);
        List<Image> i = imageExtensionRepository.findAllByOrganizationIdAndUserId(organizationId, userId);
        return i;
    }
}
