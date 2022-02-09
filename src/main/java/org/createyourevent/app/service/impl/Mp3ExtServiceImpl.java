package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Mp3;
import org.createyourevent.app.repository.Mp3ExtRepository;
import org.createyourevent.app.repository.Mp3Repository;
import org.createyourevent.app.service.Mp3ExtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Mp3}.
 */
@Service
@Transactional
public class Mp3ExtServiceImpl implements Mp3ExtService {

    private final Logger log = LoggerFactory.getLogger(Mp3ServiceImpl.class);

    private final Mp3ExtRepository mp3ExtRepository;

    public Mp3ExtServiceImpl(Mp3ExtRepository mp3ExtRepository) {
        this.mp3ExtRepository = mp3ExtRepository;
    }

    @Override
    public List<Mp3> findByUserIdAndServiceId(String userId, Long serviceId) {
        return mp3ExtRepository.findByUserAndService(userId, serviceId);
    }

    @Override
    public List<Mp3> findByUserIdAndProductId(String userId, Long productId) {
        return mp3ExtRepository.findByUserAndProduct(userId, productId);
    }

    @Override
    public List<Mp3> findByUserIdAndEventId(String userId, Long eventId) {
        return mp3ExtRepository.findByUserAndEvent(userId, eventId);
    }

    @Override
    public List<Mp3> findByEventId(Long eventId) {
        return mp3ExtRepository.findByEvent(eventId);
    }

    @Override
    public List<Mp3> findByUserIdAndShopId(String userId, Long shopId) {
        return mp3ExtRepository.findByShopAndUser(userId, shopId);
    }

    @Override
    public List<Mp3> findByService(Long serviceId) {
        return mp3ExtRepository.findByService(serviceId);
    }

    @Override
    public List<Mp3> findByProductId(Long productId) {
        return mp3ExtRepository.findByProduct(productId);
    }

    @Override
    public List<Mp3> findByShopId(Long shopId) {
        return mp3ExtRepository.findByShop(shopId);
    }
}
