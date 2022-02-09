package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.TagsExtService;
import org.createyourevent.app.service.TagsService;
import org.createyourevent.app.domain.Tags;
import org.createyourevent.app.repository.TagsExtRepository;
import org.createyourevent.app.repository.TagsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Tags}.
 */
@Service
@Transactional
public class TagsExtServiceImpl implements TagsExtService {

    private final Logger log = LoggerFactory.getLogger(TagsServiceImpl.class);

    private final TagsExtRepository tagsExtRepository;

    public TagsExtServiceImpl(TagsExtRepository tagsExtRepository) {
        this.tagsExtRepository = tagsExtRepository;
    }


    @Override
    public void deleteByProductId(Long productId) {
        log.debug("Request to delete Tags by product: {}", productId);
        tagsExtRepository.deleteByProductId(productId);
    }

    @Override
    public void deleteByEventId(Long eventId) {
        log.debug("Request to delete Tags by event: {}", eventId);
        tagsExtRepository.deleteByEventId(eventId);
    }

    @Override
    public void deleteByShopId(Long shopId) {
        log.debug("Request to delete Tags by shop: {}", shopId);
        tagsExtRepository.deleteByShopId(shopId);
    }

    @Override
    public void deleteByCreateYourEventServiceId(Long serviceId) {
        log.debug("Request to delete Tags by service: {}", serviceId);
        tagsExtRepository.deleteByServiceId(serviceId);
    }

    @Override
    public void deleteByOrganizationId(Long organizationId) {
        log.debug("Request to delete Tags by organization: {}", organizationId);
        tagsExtRepository.deleteByOrganizationId(organizationId);
    }

    @Override
    public List<Tags> findByProductId(Long productId) {
        return tagsExtRepository.findByProductId(productId);
    }

    @Override
    public List<Tags> findByEventId(Long eventId) {
        return tagsExtRepository.findByEventId(eventId);
    }

    @Override
    public List<Tags> findByShopId(Long shopId) {
        return tagsExtRepository.findByShopId(shopId);
    }

    @Override
    public List<Tags> findByServiceId(Long serviceId) {
        return tagsExtRepository.findByServiceId(serviceId);
    }

    @Override
    public List<Tags> findByOrganizationId(Long organizationId) {
        return tagsExtRepository.findByOrganizationId(organizationId);
    }

    @Override
    public List<Tags> findAll() {
        List<Tags> t = tagsExtRepository.findAll();
        return t;
    }

    @Override
    public List<Tags> findAllTagsWithActiveTrue() {
        List<Tags> t = tagsExtRepository.findAllWithActiveTrue();
        return t;
    }

    @Override
    public List<Tags> find50Item() {
        List<Tags> t = tagsExtRepository.find50Item();
        return t;
    }

    @Override
    public List<Tags> find50EventItem() {
        List<Tags> t = tagsExtRepository.find50EventItem();
        return t;
    }
}
