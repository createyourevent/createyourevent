package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Hotel;
import org.createyourevent.app.repository.HotelRepository;
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
public class HotelServiceImpl implements HotelService {

    private final Logger log = LoggerFactory.getLogger(HotelServiceImpl.class);

    private final HotelRepository hotelRepository;

    public HotelServiceImpl(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    public Hotel save(Hotel hotel) {
        log.debug("Request to save Hotel : {}", hotel);
        return hotelRepository.save(hotel);
    }

    @Override
    public Optional<Hotel> partialUpdate(Hotel hotel) {
        log.debug("Request to partially update Hotel : {}", hotel);

        return hotelRepository
            .findById(hotel.getId())
            .map(existingHotel -> {
                if (hotel.getMenu() != null) {
                    existingHotel.setMenu(hotel.getMenu());
                }
                if (hotel.getPlacesToSleep() != null) {
                    existingHotel.setPlacesToSleep(hotel.getPlacesToSleep());
                }

                return existingHotel;
            })
            .map(hotelRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Hotel> findAll(Pageable pageable) {
        log.debug("Request to get all Hotels");
        return hotelRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Hotel> findOne(Long id) {
        log.debug("Request to get Hotel : {}", id);
        return hotelRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Hotel : {}", id);
        hotelRepository.deleteById(id);
    }
}
