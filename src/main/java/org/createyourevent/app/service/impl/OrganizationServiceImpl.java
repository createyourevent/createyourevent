package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.Organization;
import org.createyourevent.app.repository.OrganizationRepository;
import org.createyourevent.app.service.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Organization}.
 */
@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    private final Logger log = LoggerFactory.getLogger(OrganizationServiceImpl.class);

    private final OrganizationRepository organizationRepository;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    @Override
    public Organization save(Organization organization) {
        log.debug("Request to save Organization : {}", organization);
        return organizationRepository.save(organization);
    }

    @Override
    public Optional<Organization> partialUpdate(Organization organization) {
        log.debug("Request to partially update Organization : {}", organization);

        return organizationRepository
            .findById(organization.getId())
            .map(existingOrganization -> {
                if (organization.getName() != null) {
                    existingOrganization.setName(organization.getName());
                }
                if (organization.getOrganizationType() != null) {
                    existingOrganization.setOrganizationType(organization.getOrganizationType());
                }
                if (organization.getLogo() != null) {
                    existingOrganization.setLogo(organization.getLogo());
                }
                if (organization.getLogoContentType() != null) {
                    existingOrganization.setLogoContentType(organization.getLogoContentType());
                }
                if (organization.getActive() != null) {
                    existingOrganization.setActive(organization.getActive());
                }
                if (organization.getActiveOwner() != null) {
                    existingOrganization.setActiveOwner(organization.getActiveOwner());
                }
                if (organization.getDescription() != null) {
                    existingOrganization.setDescription(organization.getDescription());
                }
                if (organization.getAddress() != null) {
                    existingOrganization.setAddress(organization.getAddress());
                }
                if (organization.getMotto() != null) {
                    existingOrganization.setMotto(organization.getMotto());
                }
                if (organization.getPhone() != null) {
                    existingOrganization.setPhone(organization.getPhone());
                }
                if (organization.getWebAddress() != null) {
                    existingOrganization.setWebAddress(organization.getWebAddress());
                }
                if (organization.getPlaceNumber() != null) {
                    existingOrganization.setPlaceNumber(organization.getPlaceNumber());
                }
                if (organization.getPrice() != null) {
                    existingOrganization.setPrice(organization.getPrice());
                }
                if (organization.getRentType() != null) {
                    existingOrganization.setRentType(organization.getRentType());
                }
                if (organization.getRentable() != null) {
                    existingOrganization.setRentable(organization.getRentable());
                }

                return existingOrganization;
            })
            .map(organizationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Organization> findAll(Pageable pageable) {
        log.debug("Request to get all Organizations");
        return organizationRepository.findAll(pageable);
    }

    /**
     *  Get all the organizations where Restaurant is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Organization> findAllWhereRestaurantIsNull() {
        log.debug("Request to get all organizations where Restaurant is null");
        return StreamSupport
            .stream(organizationRepository.findAll().spliterator(), false)
            .filter(organization -> organization.getRestaurant() == null)
            .collect(Collectors.toList());
    }

    /**
     *  Get all the organizations where Hotel is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Organization> findAllWhereHotelIsNull() {
        log.debug("Request to get all organizations where Hotel is null");
        return StreamSupport
            .stream(organizationRepository.findAll().spliterator(), false)
            .filter(organization -> organization.getHotel() == null)
            .collect(Collectors.toList());
    }

    /**
     *  Get all the organizations where Club is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Organization> findAllWhereClubIsNull() {
        log.debug("Request to get all organizations where Club is null");
        return StreamSupport
            .stream(organizationRepository.findAll().spliterator(), false)
            .filter(organization -> organization.getClub() == null)
            .collect(Collectors.toList());
    }

    /**
     *  Get all the organizations where Building is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Organization> findAllWhereBuildingIsNull() {
        log.debug("Request to get all organizations where Building is null");
        return StreamSupport
            .stream(organizationRepository.findAll().spliterator(), false)
            .filter(organization -> organization.getBuilding() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Organization> findOne(Long id) {
        log.debug("Request to get Organization : {}", id);
        return organizationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Organization : {}", id);
        organizationRepository.deleteById(id);
    }
}
