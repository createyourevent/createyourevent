package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReservationTransactionIdTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReservationTransactionId.class);
        ReservationTransactionId reservationTransactionId1 = new ReservationTransactionId();
        reservationTransactionId1.setId(1L);
        ReservationTransactionId reservationTransactionId2 = new ReservationTransactionId();
        reservationTransactionId2.setId(reservationTransactionId1.getId());
        assertThat(reservationTransactionId1).isEqualTo(reservationTransactionId2);
        reservationTransactionId2.setId(2L);
        assertThat(reservationTransactionId1).isNotEqualTo(reservationTransactionId2);
        reservationTransactionId1.setId(null);
        assertThat(reservationTransactionId1).isNotEqualTo(reservationTransactionId2);
    }
}
