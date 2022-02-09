package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.AdminFeesPrice;
import org.createyourevent.app.repository.AdminFeesPriceRepository;
import org.createyourevent.app.service.AdminFeesPriceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link AdminFeesPrice}.
 */
@Service
@Transactional
public class AdminFeesPriceServiceImpl implements AdminFeesPriceService {

    private final Logger log = LoggerFactory.getLogger(AdminFeesPriceServiceImpl.class);

    private final AdminFeesPriceRepository adminFeesPriceRepository;

    public AdminFeesPriceServiceImpl(AdminFeesPriceRepository adminFeesPriceRepository) {
        this.adminFeesPriceRepository = adminFeesPriceRepository;
    }

    @Override
    public AdminFeesPrice save(AdminFeesPrice adminFeesPrice) {
        log.debug("Request to save AdminFeesPrice : {}", adminFeesPrice);
        return adminFeesPriceRepository.save(adminFeesPrice);
    }

    @Override
    public Optional<AdminFeesPrice> partialUpdate(AdminFeesPrice adminFeesPrice) {
        log.debug("Request to partially update AdminFeesPrice : {}", adminFeesPrice);

        return adminFeesPriceRepository
            .findById(adminFeesPrice.getId())
            .map(existingAdminFeesPrice -> {
                if (adminFeesPrice.getFeesOrganisator() != null) {
                    existingAdminFeesPrice.setFeesOrganisator(adminFeesPrice.getFeesOrganisator());
                }
                if (adminFeesPrice.getFeesSupplier() != null) {
                    existingAdminFeesPrice.setFeesSupplier(adminFeesPrice.getFeesSupplier());
                }
                if (adminFeesPrice.getFeesService() != null) {
                    existingAdminFeesPrice.setFeesService(adminFeesPrice.getFeesService());
                }
                if (adminFeesPrice.getFeesOrganizations() != null) {
                    existingAdminFeesPrice.setFeesOrganizations(adminFeesPrice.getFeesOrganizations());
                }

                return existingAdminFeesPrice;
            })
            .map(adminFeesPriceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminFeesPrice> findAll(Pageable pageable) {
        log.debug("Request to get all AdminFeesPrices");
        return adminFeesPriceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AdminFeesPrice> findOne(Long id) {
        log.debug("Request to get AdminFeesPrice : {}", id);
        return adminFeesPriceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete AdminFeesPrice : {}", id);
        adminFeesPriceRepository.deleteById(id);
    }
}
