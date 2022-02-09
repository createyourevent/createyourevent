package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FeeTransactionId.
 */
@Entity
@Table(name = "fee_transaction_id")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FeeTransactionId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "transaction_id")
    private String transactionId;

    @JsonIgnoreProperties(
        value = { "eventProductOrder", "eventServiceMapOrder", "event", "organizationReservation", "entries" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "transactionId")
    private FeeTransaction feeTransaction;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FeeTransactionId id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return this.transactionId;
    }

    public FeeTransactionId transactionId(String transactionId) {
        this.setTransactionId(transactionId);
        return this;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public FeeTransaction getFeeTransaction() {
        return this.feeTransaction;
    }

    public void setFeeTransaction(FeeTransaction feeTransaction) {
        if (this.feeTransaction != null) {
            this.feeTransaction.setTransactionId(null);
        }
        if (feeTransaction != null) {
            feeTransaction.setTransactionId(this);
        }
        this.feeTransaction = feeTransaction;
    }

    public FeeTransactionId feeTransaction(FeeTransaction feeTransaction) {
        this.setFeeTransaction(feeTransaction);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FeeTransactionId)) {
            return false;
        }
        return id != null && id.equals(((FeeTransactionId) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FeeTransactionId{" +
            "id=" + getId() +
            ", transactionId='" + getTransactionId() + "'" +
            "}";
    }
}
