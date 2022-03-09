package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SlotListPlumTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SlotListPlum.class);
        SlotListPlum slotListPlum1 = new SlotListPlum();
        slotListPlum1.setId(1L);
        SlotListPlum slotListPlum2 = new SlotListPlum();
        slotListPlum2.setId(slotListPlum1.getId());
        assertThat(slotListPlum1).isEqualTo(slotListPlum2);
        slotListPlum2.setId(2L);
        assertThat(slotListPlum1).isNotEqualTo(slotListPlum2);
        slotListPlum1.setId(null);
        assertThat(slotListPlum1).isNotEqualTo(slotListPlum2);
    }
}
