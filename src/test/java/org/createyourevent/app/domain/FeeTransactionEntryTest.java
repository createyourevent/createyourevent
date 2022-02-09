package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FeeTransactionEntryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FeeTransactionEntry.class);
        FeeTransactionEntry feeTransactionEntry1 = new FeeTransactionEntry();
        feeTransactionEntry1.setId(1L);
        FeeTransactionEntry feeTransactionEntry2 = new FeeTransactionEntry();
        feeTransactionEntry2.setId(feeTransactionEntry1.getId());
        assertThat(feeTransactionEntry1).isEqualTo(feeTransactionEntry2);
        feeTransactionEntry2.setId(2L);
        assertThat(feeTransactionEntry1).isNotEqualTo(feeTransactionEntry2);
        feeTransactionEntry1.setId(null);
        assertThat(feeTransactionEntry1).isNotEqualTo(feeTransactionEntry2);
    }
}
