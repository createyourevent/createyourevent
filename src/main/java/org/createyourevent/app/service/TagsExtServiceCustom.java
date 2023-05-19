package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Tags;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Tags}.
 */
public interface TagsExtServiceCustom {
    List<Tags> findAllTagsWithActiveTrue();
    List<Tags> find50Item();
    List<Tags> find50EventItem();
}
