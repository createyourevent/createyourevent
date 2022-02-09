package org.createyourevent.app.service;

import org.createyourevent.app.domain.ChipsAdmin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link ChipsAdmin}.
 */
public interface ChipsAdminExtService {
    void deleteAllFoundedChips();
}
