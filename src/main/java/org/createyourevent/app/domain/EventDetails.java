package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EventDetails.
 */
@Entity
@Table(name = "event_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EventDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "total_entrance_fee")
    private Float totalEntranceFee;

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
            "organizationReservations",
        },
        allowSetters = true
    )
    @OneToOne(mappedBy = "eventDetail")
    private Event event;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EventDetails id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getTotalEntranceFee() {
        return this.totalEntranceFee;
    }

    public EventDetails totalEntranceFee(Float totalEntranceFee) {
        this.setTotalEntranceFee(totalEntranceFee);
        return this;
    }

    public void setTotalEntranceFee(Float totalEntranceFee) {
        this.totalEntranceFee = totalEntranceFee;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        if (this.event != null) {
            this.event.setEventDetail(null);
        }
        if (event != null) {
            event.setEventDetail(this);
        }
        this.event = event;
    }

    public EventDetails event(Event event) {
        this.setEvent(event);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventDetails)) {
            return false;
        }
        return id != null && id.equals(((EventDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventDetails{" +
            "id=" + getId() +
            ", totalEntranceFee=" + getTotalEntranceFee() +
            "}";
    }
}
