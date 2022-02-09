package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Mp3;
import org.createyourevent.app.repository.Mp3Repository;
import org.createyourevent.app.service.Mp3Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Mp3}.
 */
@Service
@Transactional
public class Mp3ServiceImpl implements Mp3Service {

    private final Logger log = LoggerFactory.getLogger(Mp3ServiceImpl.class);

    private final Mp3Repository mp3Repository;

    public Mp3ServiceImpl(Mp3Repository mp3Repository) {
        this.mp3Repository = mp3Repository;
    }

    @Override
    public Mp3 save(Mp3 mp3) {
        log.debug("Request to save Mp3 : {}", mp3);
        return mp3Repository.save(mp3);
    }

    @Override
    public Optional<Mp3> partialUpdate(Mp3 mp3) {
        log.debug("Request to partially update Mp3 : {}", mp3);

        return mp3Repository
            .findById(mp3.getId())
            .map(existingMp3 -> {
                if (mp3.getTitle() != null) {
                    existingMp3.setTitle(mp3.getTitle());
                }
                if (mp3.getArtists() != null) {
                    existingMp3.setArtists(mp3.getArtists());
                }
                if (mp3.getDuration() != null) {
                    existingMp3.setDuration(mp3.getDuration());
                }
                if (mp3.getUrl() != null) {
                    existingMp3.setUrl(mp3.getUrl());
                }

                return existingMp3;
            })
            .map(mp3Repository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Mp3> findAll(Pageable pageable) {
        log.debug("Request to get all Mp3s");
        return mp3Repository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Mp3> findOne(Long id) {
        log.debug("Request to get Mp3 : {}", id);
        return mp3Repository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Mp3 : {}", id);
        mp3Repository.deleteById(id);
    }
}
