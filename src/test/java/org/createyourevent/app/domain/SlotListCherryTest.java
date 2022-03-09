package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SlotListCherryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SlotListCherry.class);
        SlotListCherry slotListCherry1 = new SlotListCherry();
        slotListCherry1.setId(1L);
        SlotListCherry slotListCherry2 = new SlotListCherry();
        slotListCherry2.setId(slotListCherry1.getId());
        assertThat(slotListCherry1).isEqualTo(slotListCherry2);
        slotListCherry2.setId(2L);
        assertThat(slotListCherry1).isNotEqualTo(slotListCherry2);
        slotListCherry1.setId(null);
        assertThat(slotListCherry1).isNotEqualTo(slotListCherry2);
    }
}
