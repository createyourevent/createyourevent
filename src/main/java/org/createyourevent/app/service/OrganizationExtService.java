package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Organization;
import org.createyourevent.app.domain.enumeration.OrganizationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Organization}.
 */
public interface OrganizationExtService {
    List<Organization> findByUserIdAndActiveTrue(String userId);

    List<Organization> findByCurrentUser();

    List<Organization> findByOrganizationType(OrganizationType productType);

    List<Organization> findByOrganizationTypeAndActiveTrueAndActiveOwner(OrganizationType productType);

    List<Organization> findByActiveTrue();

    List<Organization> findByActiveTrueAndActiveOwnerTrue();
}
