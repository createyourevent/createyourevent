package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ServiceMapTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ServiceMap.class);
        ServiceMap serviceMap1 = new ServiceMap();
        serviceMap1.setId(1L);
        ServiceMap serviceMap2 = new ServiceMap();
        serviceMap2.setId(serviceMap1.getId());
        assertThat(serviceMap1).isEqualTo(serviceMap2);
        serviceMap2.setId(2L);
        assertThat(serviceMap1).isNotEqualTo(serviceMap2);
        serviceMap1.setId(null);
        assertThat(serviceMap1).isNotEqualTo(serviceMap2);
    }
}
