package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ServiceOfferTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ServiceOffer.class);
        ServiceOffer serviceOffer1 = new ServiceOffer();
        serviceOffer1.setId(1L);
        ServiceOffer serviceOffer2 = new ServiceOffer();
        serviceOffer2.setId(serviceOffer1.getId());
        assertThat(serviceOffer1).isEqualTo(serviceOffer2);
        serviceOffer2.setId(2L);
        assertThat(serviceOffer1).isNotEqualTo(serviceOffer2);
        serviceOffer1.setId(null);
        assertThat(serviceOffer1).isNotEqualTo(serviceOffer2);
    }
}
