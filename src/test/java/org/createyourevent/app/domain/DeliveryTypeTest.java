package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DeliveryTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DeliveryType.class);
        DeliveryType deliveryType1 = new DeliveryType();
        deliveryType1.setId(1L);
        DeliveryType deliveryType2 = new DeliveryType();
        deliveryType2.setId(deliveryType1.getId());
        assertThat(deliveryType1).isEqualTo(deliveryType2);
        deliveryType2.setId(2L);
        assertThat(deliveryType1).isNotEqualTo(deliveryType2);
        deliveryType1.setId(null);
        assertThat(deliveryType1).isNotEqualTo(deliveryType2);
    }
}
