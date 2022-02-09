package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Club;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Club}.
 */
public interface ClubExtService {
    List<Club> findByUserIsCurrentUserAndActive();
    Club findByOrganizationId(Long id);
}
