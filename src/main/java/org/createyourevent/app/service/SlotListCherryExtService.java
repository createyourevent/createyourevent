package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListCherry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SlotListCherry}.
 */
public interface SlotListCherryExtService {
    void deleteAll();
}
