package org.createyourevent.app.service;

import org.createyourevent.app.domain.ChipsCollection;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ChipsCollection}.
 */
public interface ChipsCollectionExtService {
    ChipsCollection findChipsCollectionByUserId(String userId);
}
