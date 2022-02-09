package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Club;
import org.createyourevent.app.repository.ClubExtRepository;
import org.createyourevent.app.repository.ClubRepository;
import org.createyourevent.app.service.ClubExtService;
import org.createyourevent.app.service.ClubService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Club}.
 */
@Service
@Transactional
public class ClubExtServiceImpl implements ClubExtService {

    private final Logger log = LoggerFactory.getLogger(ClubExtServiceImpl.class);

    private final ClubExtRepository clubExtRepository;

    public ClubExtServiceImpl(ClubExtRepository clubExtRepository) {
        this.clubExtRepository = clubExtRepository;
    }

    @Override
    public List<Club> findByUserIsCurrentUserAndActive() {
        return this.clubExtRepository.findByUserIsCurrentUserAndActive();
    }

    @Override
    public Club findByOrganizationId(Long id) {
        return this.clubExtRepository.findByOrganizationId(id);
    }


}
