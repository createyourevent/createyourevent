package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OrganizationReservation.
 */
@Entity
@Table(name = "organization_reservation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OrganizationReservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "date_from")
    private ZonedDateTime dateFrom;

    @Column(name = "date_until")
    private ZonedDateTime dateUntil;

    @Column(name = "seen")
    private Boolean seen;

    @Column(name = "approved")
    private Boolean approved;

    @Column(name = "total")
    private Float total;

    @Column(name = "fee_billed")
    private Boolean feeBilled;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(
        value = {
            "eventDetail",
            "eventProductOrders",
            "comments",
            "worksheets",
            "eventServiceMapOrders",
            "images",
            "mp3s",
            "user",
            "reservedUsers",
            "feeTransaction",
            "tags",
            "organizationReservations",
        },
        allowSetters = true
    )
    private Event event;

    @JsonIgnoreProperties(
        value = { "transactionId", "eventProductOrder", "eventServiceMapOrder", "event", "organizationReservation", "entries", "user" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "organizationReservation")
    private FeeTransaction feeTransaction;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "images", "organizationReservations", "tags" },
        allowSetters = true
    )
    private Organization organization;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OrganizationReservation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public OrganizationReservation date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public ZonedDateTime getDateFrom() {
        return this.dateFrom;
    }

    public OrganizationReservation dateFrom(ZonedDateTime dateFrom) {
        this.setDateFrom(dateFrom);
        return this;
    }

    public void setDateFrom(ZonedDateTime dateFrom) {
        this.dateFrom = dateFrom;
    }

    public ZonedDateTime getDateUntil() {
        return this.dateUntil;
    }

    public OrganizationReservation dateUntil(ZonedDateTime dateUntil) {
        this.setDateUntil(dateUntil);
        return this;
    }

    public void setDateUntil(ZonedDateTime dateUntil) {
        this.dateUntil = dateUntil;
    }

    public Boolean getSeen() {
        return this.seen;
    }

    public OrganizationReservation seen(Boolean seen) {
        this.setSeen(seen);
        return this;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }

    public Boolean getApproved() {
        return this.approved;
    }

    public OrganizationReservation approved(Boolean approved) {
        this.setApproved(approved);
        return this;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public Float getTotal() {
        return this.total;
    }

    public OrganizationReservation total(Float total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public Boolean getFeeBilled() {
        return this.feeBilled;
    }

    public OrganizationReservation feeBilled(Boolean feeBilled) {
        this.setFeeBilled(feeBilled);
        return this;
    }

    public void setFeeBilled(Boolean feeBilled) {
        this.feeBilled = feeBilled;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public OrganizationReservation user(User user) {
        this.setUser(user);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public OrganizationReservation event(Event event) {
        this.setEvent(event);
        return this;
    }

    public FeeTransaction getFeeTransaction() {
        return this.feeTransaction;
    }

    public void setFeeTransaction(FeeTransaction feeTransaction) {
        if (this.feeTransaction != null) {
            this.feeTransaction.setOrganizationReservation(null);
        }
        if (feeTransaction != null) {
            feeTransaction.setOrganizationReservation(this);
        }
        this.feeTransaction = feeTransaction;
    }

    public OrganizationReservation feeTransaction(FeeTransaction feeTransaction) {
        this.setFeeTransaction(feeTransaction);
        return this;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public OrganizationReservation organization(Organization organization) {
        this.setOrganization(organization);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrganizationReservation)) {
            return false;
        }
        return id != null && id.equals(((OrganizationReservation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrganizationReservation{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", dateFrom='" + getDateFrom() + "'" +
            ", dateUntil='" + getDateUntil() + "'" +
            ", seen='" + getSeen() + "'" +
            ", approved='" + getApproved() + "'" +
            ", total=" + getTotal() +
            ", feeBilled='" + getFeeBilled() + "'" +
            "}";
    }
}
