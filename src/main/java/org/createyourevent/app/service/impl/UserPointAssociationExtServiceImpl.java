package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.UserPointAssociationExtService;
import org.createyourevent.app.domain.UserPointAssociation;
import org.createyourevent.app.repository.UserPointAssociationExtRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link UserPointAssociation}.
 */
@Service
@Transactional
public class UserPointAssociationExtServiceImpl implements UserPointAssociationExtService {

    private final Logger log = LoggerFactory.getLogger(UserPointAssociationServiceImpl.class);

    private final UserPointAssociationExtRepository userPointAssociationExtRepository;

    public UserPointAssociationExtServiceImpl(UserPointAssociationExtRepository userPointAssociationExtRepository) {
        this.userPointAssociationExtRepository = userPointAssociationExtRepository;
    }

    @Override
    public List<UserPointAssociation> findByUsersId(String userId) {
        return userPointAssociationExtRepository.findByUsersId(userId);
    }

    @Override
    public List<UserPointAssociation> findByUsersIdAndDateBetween(String userId, ZonedDateTime betweenStart,
            ZonedDateTime betweenEnd) {
        return userPointAssociationExtRepository.findByUsersIdAndDateBetween(userId, betweenStart, betweenEnd);
    }

    @Override
    public List<UserPointAssociation> findByUsersIdAndPointkeyAndDateBetween(String userId, String key,
            ZonedDateTime betweenStart, ZonedDateTime betweenEnd) {
        return userPointAssociationExtRepository.findByUsersIdAndPointkeyAndDateBetween(userId, key, betweenStart, betweenEnd);
    }

    @Override
    public List<UserPointAssociation> findByUsersIdAndPointkey(String userId, String key) {
        List<UserPointAssociation> l = userPointAssociationExtRepository.findByUsersIdAndPointkey(userId, key);
        return l;
    }


}
