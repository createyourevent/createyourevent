package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ServiceCommentExtService;
import org.createyourevent.app.domain.ServiceComment;
import org.createyourevent.app.repository.ServiceCommentExtRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service Implementation for managing {@link ServiceComment}.
 */
@Service
@Transactional
public class ServiceCommentExtServiceImpl implements ServiceCommentExtService {

    private final Logger log = LoggerFactory.getLogger(ServiceCommentExtServiceImpl.class);

    private final ServiceCommentExtRepository serviceCommentExtRepository;

    public ServiceCommentExtServiceImpl(ServiceCommentExtRepository serviceCommentExtRepository) {
        this.serviceCommentExtRepository = serviceCommentExtRepository;
    }

    @Override
    public List<ServiceComment> findAllByServiceId(Long serviceId) {
        List<ServiceComment> serviceComments = this.serviceCommentExtRepository.findAllByCreateYourEventServiceId(serviceId);
        List<ServiceComment> serviceCommentsParent = new ArrayList<ServiceComment>();

        for(ServiceComment serviceComment : serviceComments) {
            if(serviceComment.getServiceComment() != null && serviceComment.getServiceComment().getId() == serviceComment.getId()) {
                serviceComment.getServiceComments().add(serviceComment.getServiceComment());
            }
        }
        for(ServiceComment shopComment : serviceComments) {
            if(shopComment.getServiceComment() == null ) {
                serviceCommentsParent.add(shopComment);
            }
        }
        return serviceCommentsParent;
    }

    @Override
    public List<ServiceComment> findAllByServiceIdAndUserId(Long serviceId, String userId) {
        log.debug("List<ServiceComment> findAllByServiceIdAndUserId(Long serviceId, String userId)");
        return serviceCommentExtRepository.findAllByCreateYourEventServiceIdAndUserId(serviceId, userId);
    }

}
