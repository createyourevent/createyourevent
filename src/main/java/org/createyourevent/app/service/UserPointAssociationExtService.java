package org.createyourevent.app.service;

import org.createyourevent.app.domain.UserPointAssociation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link UserPointAssociation}.
 */
public interface UserPointAssociationExtService {

    List<UserPointAssociation> findByUsersId(String userId);

    List<UserPointAssociation> findByUsersIdAndDateBetween(String userId, ZonedDateTime betweenStart, ZonedDateTime betweenEnd);

    List<UserPointAssociation> findByUsersIdAndPointkeyAndDateBetween(String userId, String key,  ZonedDateTime betweenStart, ZonedDateTime betweenEnd);

    List<UserPointAssociation> findByUsersIdAndPointkey(String userId, String key);
}
