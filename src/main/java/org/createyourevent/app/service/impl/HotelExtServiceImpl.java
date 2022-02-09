package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Hotel;
import org.createyourevent.app.repository.HotelExtRepository;
import org.createyourevent.app.repository.HotelRepository;
import org.createyourevent.app.service.HotelExtService;
import org.createyourevent.app.service.HotelService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Hotel}.
 */
@Service
@Transactional
public class HotelExtServiceImpl implements HotelExtService {

    private final Logger log = LoggerFactory.getLogger(HotelExtServiceImpl.class);

    private final HotelExtRepository hotelExtRepository;

    public HotelExtServiceImpl(HotelExtRepository hotelExtRepository) {
        this.hotelExtRepository = hotelExtRepository;
    }

    @Override
    public List<Hotel> findByUserIsCurrentUserAndActive() {
        return this.hotelExtRepository.findByUserIsCurrentUserAndActive();
    }

    @Override
    public Hotel findByOrganizationId(Long id) {
        return this.hotelExtRepository.findByOrganizationId(id);
    }


}
