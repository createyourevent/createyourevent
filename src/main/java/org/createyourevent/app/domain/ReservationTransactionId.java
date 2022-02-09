package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ReservationTransactionId.
 */
@Entity
@Table(name = "reservation_transaction_id")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ReservationTransactionId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "transaction_deposit_id")
    private String transactionDepositId;

    @Column(name = "transaction_id")
    private String transactionId;

    @JsonIgnoreProperties(value = { "transactionId", "ticket", "user", "event" }, allowSetters = true)
    @OneToOne(mappedBy = "transactionId")
    private Reservation reservation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ReservationTransactionId id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionDepositId() {
        return this.transactionDepositId;
    }

    public ReservationTransactionId transactionDepositId(String transactionDepositId) {
        this.setTransactionDepositId(transactionDepositId);
        return this;
    }

    public void setTransactionDepositId(String transactionDepositId) {
        this.transactionDepositId = transactionDepositId;
    }

    public String getTransactionId() {
        return this.transactionId;
    }

    public ReservationTransactionId transactionId(String transactionId) {
        this.setTransactionId(transactionId);
        return this;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Reservation getReservation() {
        return this.reservation;
    }

    public void setReservation(Reservation reservation) {
        if (this.reservation != null) {
            this.reservation.setTransactionId(null);
        }
        if (reservation != null) {
            reservation.setTransactionId(this);
        }
        this.reservation = reservation;
    }

    public ReservationTransactionId reservation(Reservation reservation) {
        this.setReservation(reservation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReservationTransactionId)) {
            return false;
        }
        return id != null && id.equals(((ReservationTransactionId) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReservationTransactionId{" +
            "id=" + getId() +
            ", transactionDepositId='" + getTransactionDepositId() + "'" +
            ", transactionId='" + getTransactionId() + "'" +
            "}";
    }
}
