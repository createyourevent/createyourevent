package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListOrange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SlotListOrange}.
 */
public interface SlotListOrangeExtService {
    void deleteAll();
}
