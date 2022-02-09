package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Hotel}.
 */
public interface HotelExtService {
    List<Hotel> findByUserIsCurrentUserAndActive();
    Hotel findByOrganizationId(Long id);
}
