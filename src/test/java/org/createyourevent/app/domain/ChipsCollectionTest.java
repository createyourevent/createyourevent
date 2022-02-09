package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChipsCollectionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChipsCollection.class);
        ChipsCollection chipsCollection1 = new ChipsCollection();
        chipsCollection1.setId(1L);
        ChipsCollection chipsCollection2 = new ChipsCollection();
        chipsCollection2.setId(chipsCollection1.getId());
        assertThat(chipsCollection1).isEqualTo(chipsCollection2);
        chipsCollection2.setId(2L);
        assertThat(chipsCollection1).isNotEqualTo(chipsCollection2);
        chipsCollection1.setId(null);
        assertThat(chipsCollection1).isNotEqualTo(chipsCollection2);
    }
}
