package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListPlum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SlotListPlum}.
 */
public interface SlotListPlumExtService {
    void deleteAll();
}
