package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChipsCollectionChipsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChipsCollectionChips.class);
        ChipsCollectionChips chipsCollectionChips1 = new ChipsCollectionChips();
        chipsCollectionChips1.setId(1L);
        ChipsCollectionChips chipsCollectionChips2 = new ChipsCollectionChips();
        chipsCollectionChips2.setId(chipsCollectionChips1.getId());
        assertThat(chipsCollectionChips1).isEqualTo(chipsCollectionChips2);
        chipsCollectionChips2.setId(2L);
        assertThat(chipsCollectionChips1).isNotEqualTo(chipsCollectionChips2);
        chipsCollectionChips1.setId(null);
        assertThat(chipsCollectionChips1).isNotEqualTo(chipsCollectionChips2);
    }
}
