package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FeeTransaction.
 */
@Entity
@Table(name = "fee_transaction")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FeeTransaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private ZonedDateTime date;

    @JsonIgnoreProperties(value = { "feeTransaction" }, allowSetters = true)
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(unique = true)
    private FeeTransactionId transactionId;

    @JsonIgnoreProperties(value = { "user", "feeTransaction", "event", "product", "shop", "cart", "deliveryType" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private EventProductOrder eventProductOrder;

    @JsonIgnoreProperties(value = { "feeTransaction", "event", "serviceMap", "cart" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private EventServiceMapOrder eventServiceMapOrder;

    @JsonIgnoreProperties(
        value = {
            "location",
            "eventDetail",
            "eventProductOrders",
            "reservations",
            "comments",
            "worksheets",
            "eventServiceMapOrders",
            "images",
            "mp3s",
            "user",
            "reservedUsers",
            "feeTransaction",
            "tags",
        },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private Event event;

    @JsonIgnoreProperties(value = { "user", "event", "feeTransaction", "organization" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private OrganizationReservation organizationReservation;

    @OneToMany(mappedBy = "feeTransaction", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "feeTransaction" }, allowSetters = true)
    private Set<FeeTransactionEntry> entries = new HashSet<>();

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FeeTransaction id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public FeeTransaction date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public FeeTransactionId getTransactionId() {
        return this.transactionId;
    }

    public void setTransactionId(FeeTransactionId feeTransactionId) {
        this.transactionId = feeTransactionId;
    }

    public FeeTransaction transactionId(FeeTransactionId feeTransactionId) {
        this.setTransactionId(feeTransactionId);
        return this;
    }

    public EventProductOrder getEventProductOrder() {
        return this.eventProductOrder;
    }

    public void setEventProductOrder(EventProductOrder eventProductOrder) {
        this.eventProductOrder = eventProductOrder;
    }

    public FeeTransaction eventProductOrder(EventProductOrder eventProductOrder) {
        this.setEventProductOrder(eventProductOrder);
        return this;
    }

    public EventServiceMapOrder getEventServiceMapOrder() {
        return this.eventServiceMapOrder;
    }

    public void setEventServiceMapOrder(EventServiceMapOrder eventServiceMapOrder) {
        this.eventServiceMapOrder = eventServiceMapOrder;
    }

    public FeeTransaction eventServiceMapOrder(EventServiceMapOrder eventServiceMapOrder) {
        this.setEventServiceMapOrder(eventServiceMapOrder);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public FeeTransaction event(Event event) {
        this.setEvent(event);
        return this;
    }

    public OrganizationReservation getOrganizationReservation() {
        return this.organizationReservation;
    }

    public void setOrganizationReservation(OrganizationReservation organizationReservation) {
        this.organizationReservation = organizationReservation;
    }

    public FeeTransaction organizationReservation(OrganizationReservation organizationReservation) {
        this.setOrganizationReservation(organizationReservation);
        return this;
    }

    public Set<FeeTransactionEntry> getEntries() {
        return this.entries;
    }

    public void setEntries(Set<FeeTransactionEntry> feeTransactionEntries) {
        if (this.entries != null) {
            this.entries.forEach(i -> i.setFeeTransaction(null));
        }
        if (feeTransactionEntries != null) {
            feeTransactionEntries.forEach(i -> i.setFeeTransaction(this));
        }
        this.entries = feeTransactionEntries;
    }

    public FeeTransaction entries(Set<FeeTransactionEntry> feeTransactionEntries) {
        this.setEntries(feeTransactionEntries);
        return this;
    }

    public FeeTransaction addEntries(FeeTransactionEntry feeTransactionEntry) {
        this.entries.add(feeTransactionEntry);
        feeTransactionEntry.setFeeTransaction(this);
        return this;
    }

    public FeeTransaction removeEntries(FeeTransactionEntry feeTransactionEntry) {
        this.entries.remove(feeTransactionEntry);
        feeTransactionEntry.setFeeTransaction(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public FeeTransaction user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FeeTransaction)) {
            return false;
        }
        return id != null && id.equals(((FeeTransaction) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FeeTransaction{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
