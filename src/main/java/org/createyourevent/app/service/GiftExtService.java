package org.createyourevent.app.service;

import org.createyourevent.app.domain.Gift;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Gift}.
 */
public interface GiftExtService {

    List<Gift> findByActiveTrue();
}
