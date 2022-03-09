package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListClock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SlotListClock}.
 */
public interface SlotListClockExtService {
    void deleteAll();
}
