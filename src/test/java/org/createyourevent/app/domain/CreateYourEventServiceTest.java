package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CreateYourEventServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CreateYourEventService.class);
        CreateYourEventService createYourEventService1 = new CreateYourEventService();
        createYourEventService1.setId(1L);
        CreateYourEventService createYourEventService2 = new CreateYourEventService();
        createYourEventService2.setId(createYourEventService1.getId());
        assertThat(createYourEventService1).isEqualTo(createYourEventService2);
        createYourEventService2.setId(2L);
        assertThat(createYourEventService1).isNotEqualTo(createYourEventService2);
        createYourEventService1.setId(null);
        assertThat(createYourEventService1).isNotEqualTo(createYourEventService2);
    }
}
