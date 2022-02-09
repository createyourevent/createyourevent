package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.createyourevent.app.domain.enumeration.FeeType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FeeTransactionEntry.
 */
@Entity
@Table(name = "fee_transaction_entry")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FeeTransactionEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private FeeType type;

    @Column(name = "value")
    private Float value;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "transactionId", "eventProductOrder", "eventServiceMapOrder", "event", "organizationReservation", "entries", "user" },
        allowSetters = true
    )
    private FeeTransaction feeTransaction;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FeeTransactionEntry id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FeeType getType() {
        return this.type;
    }

    public FeeTransactionEntry type(FeeType type) {
        this.setType(type);
        return this;
    }

    public void setType(FeeType type) {
        this.type = type;
    }

    public Float getValue() {
        return this.value;
    }

    public FeeTransactionEntry value(Float value) {
        this.setValue(value);
        return this;
    }

    public void setValue(Float value) {
        this.value = value;
    }

    public FeeTransaction getFeeTransaction() {
        return this.feeTransaction;
    }

    public void setFeeTransaction(FeeTransaction feeTransaction) {
        this.feeTransaction = feeTransaction;
    }

    public FeeTransactionEntry feeTransaction(FeeTransaction feeTransaction) {
        this.setFeeTransaction(feeTransaction);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FeeTransactionEntry)) {
            return false;
        }
        return id != null && id.equals(((FeeTransactionEntry) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FeeTransactionEntry{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", value=" + getValue() +
            "}";
    }
}
