package org.createyourevent.app.repository;

import org.createyourevent.app.domain.Address;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Address entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AddressExtensionRepository extends JpaRepository<Address, Long> {

    Address findByLocationId(Long id);
}
