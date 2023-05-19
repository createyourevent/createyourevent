package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.createyourevent.app.domain.Tags;
import org.createyourevent.app.repository.TagsExtRepository;
import org.createyourevent.app.repository.TagsRepository;
import org.createyourevent.app.service.TagsExtService;
import org.createyourevent.app.service.TagsExtServiceCustom;
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
public class TagsExtServiceCustomImpl implements TagsExtServiceCustom {

    private final Logger log = LoggerFactory.getLogger(TagsExtServiceCustomImpl.class);
    private EntityManager entityManager;

    @Override
    public List<Tags> findAllTagsWithActiveTrue() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Tags> query = cb.createQuery(Tags.class);
        Root<Tags> root = query.from(Tags.class);
        Predicate activePredicate = cb.or(
            cb.isTrue(root.get("product").get("active")),
            cb.isTrue(root.get("event").get("active")),
            cb.isTrue(root.get("shop").get("active")),
            cb.isTrue(root.get("service").get("active")),
            cb.isTrue(root.get("organization").get("active"))
        );
        query.where(activePredicate);
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public List<Tags> find50Item() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Tags> query = cb.createQuery(Tags.class);
        Root<Tags> root = query.from(Tags.class);
        query.orderBy(cb.asc(root.get("id")));
        return entityManager.createQuery(query).setMaxResults(50).getResultList();
    }

    @Override
    public List<Tags> find50EventItem() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Tags> query = cb.createQuery(Tags.class);
        Root<Tags> root = query.from(Tags.class);
        query.orderBy(cb.asc(root.get("id")));
        return entityManager.createQuery(query).getResultList();
    }
}
