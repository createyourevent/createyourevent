package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Partner;
import org.createyourevent.app.repository.PartnerRepository;
import org.createyourevent.app.service.PartnerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Partner}.
 */
@Service
@Transactional
public class PartnerServiceImpl implements PartnerService {

    private final Logger log = LoggerFactory.getLogger(PartnerServiceImpl.class);

    private final PartnerRepository partnerRepository;

    public PartnerServiceImpl(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    @Override
    public Partner save(Partner partner) {
        log.debug("Request to save Partner : {}", partner);
        return partnerRepository.save(partner);
    }

    @Override
    public Optional<Partner> partialUpdate(Partner partner) {
        log.debug("Request to partially update Partner : {}", partner);

        return partnerRepository
            .findById(partner.getId())
            .map(existingPartner -> {
                if (partner.getName() != null) {
                    existingPartner.setName(partner.getName());
                }
                if (partner.getAddress() != null) {
                    existingPartner.setAddress(partner.getAddress());
                }
                if (partner.getPhone() != null) {
                    existingPartner.setPhone(partner.getPhone());
                }
                if (partner.getLogo() != null) {
                    existingPartner.setLogo(partner.getLogo());
                }
                if (partner.getLogoContentType() != null) {
                    existingPartner.setLogoContentType(partner.getLogoContentType());
                }
                if (partner.getMail() != null) {
                    existingPartner.setMail(partner.getMail());
                }
                if (partner.getWebaddress() != null) {
                    existingPartner.setWebaddress(partner.getWebaddress());
                }
                if (partner.getSponsorshipAmount() != null) {
                    existingPartner.setSponsorshipAmount(partner.getSponsorshipAmount());
                }
                if (partner.getActive() != null) {
                    existingPartner.setActive(partner.getActive());
                }

                return existingPartner;
            })
            .map(partnerRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Partner> findAll(Pageable pageable) {
        log.debug("Request to get all Partners");
        return partnerRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Partner> findOne(Long id) {
        log.debug("Request to get Partner : {}", id);
        return partnerRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Partner : {}", id);
        partnerRepository.deleteById(id);
    }
}
