package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Tags;
import org.createyourevent.app.repository.TagsRepository;
import org.createyourevent.app.service.TagsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Tags}.
 */
@Service
@Transactional
public class TagsServiceImpl implements TagsService {

    private final Logger log = LoggerFactory.getLogger(TagsServiceImpl.class);

    private final TagsRepository tagsRepository;

    public TagsServiceImpl(TagsRepository tagsRepository) {
        this.tagsRepository = tagsRepository;
    }

    @Override
    public Tags save(Tags tags) {
        log.debug("Request to save Tags : {}", tags);
        return tagsRepository.save(tags);
    }

    @Override
    public Optional<Tags> partialUpdate(Tags tags) {
        log.debug("Request to partially update Tags : {}", tags);

        return tagsRepository
            .findById(tags.getId())
            .map(existingTags -> {
                if (tags.getTag() != null) {
                    existingTags.setTag(tags.getTag());
                }

                return existingTags;
            })
            .map(tagsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Tags> findAll(Pageable pageable) {
        log.debug("Request to get all Tags");
        return tagsRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tags> findOne(Long id) {
        log.debug("Request to get Tags : {}", id);
        return tagsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tags : {}", id);
        tagsRepository.deleteById(id);
    }
}
