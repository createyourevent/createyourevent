package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrganizationReservationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrganizationReservation.class);
        OrganizationReservation organizationReservation1 = new OrganizationReservation();
        organizationReservation1.setId(1L);
        OrganizationReservation organizationReservation2 = new OrganizationReservation();
        organizationReservation2.setId(organizationReservation1.getId());
        assertThat(organizationReservation1).isEqualTo(organizationReservation2);
        organizationReservation2.setId(2L);
        assertThat(organizationReservation1).isNotEqualTo(organizationReservation2);
        organizationReservation1.setId(null);
        assertThat(organizationReservation1).isNotEqualTo(organizationReservation2);
    }
}
