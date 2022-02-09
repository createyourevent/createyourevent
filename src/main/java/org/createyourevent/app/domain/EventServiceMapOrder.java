package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EventServiceMapOrder.
 */
@Entity
@Table(name = "event_service_map_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EventServiceMapOrder implements Serializable {

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

    @Column(name = "cost_hour")
    private Float costHour;

    @Column(name = "ride_costs")
    private Float rideCosts;

    @Column(name = "total")
    private Float total;

    @Column(name = "total_hours")
    private String totalHours;

    @Column(name = "kilometre")
    private Float kilometre;

    @Column(name = "billed")
    private Boolean billed;

    @Column(name = "seen")
    private Boolean seen;

    @Column(name = "approved")
    private Boolean approved;

    @JsonIgnoreProperties(
        value = { "transactionId", "eventProductOrder", "eventServiceMapOrder", "event", "organizationReservation", "entries", "user" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "eventServiceMapOrder")
    private FeeTransaction feeTransaction;

    @ManyToOne(fetch = FetchType.EAGER)
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
    private Event event;

    @ManyToOne
    @JsonIgnoreProperties(value = { "serviceOffers", "eventServiceMapOrders" }, allowSetters = true)
    private ServiceMap serviceMap;

    @ManyToOne
    @JsonIgnoreProperties(value = { "products", "services" }, allowSetters = true)
    private Cart cart;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EventServiceMapOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public EventServiceMapOrder date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public ZonedDateTime getDateFrom() {
        return this.dateFrom;
    }

    public EventServiceMapOrder dateFrom(ZonedDateTime dateFrom) {
        this.setDateFrom(dateFrom);
        return this;
    }

    public void setDateFrom(ZonedDateTime dateFrom) {
        this.dateFrom = dateFrom;
    }

    public ZonedDateTime getDateUntil() {
        return this.dateUntil;
    }

    public EventServiceMapOrder dateUntil(ZonedDateTime dateUntil) {
        this.setDateUntil(dateUntil);
        return this;
    }

    public void setDateUntil(ZonedDateTime dateUntil) {
        this.dateUntil = dateUntil;
    }

    public Float getCostHour() {
        return this.costHour;
    }

    public EventServiceMapOrder costHour(Float costHour) {
        this.setCostHour(costHour);
        return this;
    }

    public void setCostHour(Float costHour) {
        this.costHour = costHour;
    }

    public Float getRideCosts() {
        return this.rideCosts;
    }

    public EventServiceMapOrder rideCosts(Float rideCosts) {
        this.setRideCosts(rideCosts);
        return this;
    }

    public void setRideCosts(Float rideCosts) {
        this.rideCosts = rideCosts;
    }

    public Float getTotal() {
        return this.total;
    }

    public EventServiceMapOrder total(Float total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public String getTotalHours() {
        return this.totalHours;
    }

    public EventServiceMapOrder totalHours(String totalHours) {
        this.setTotalHours(totalHours);
        return this;
    }

    public void setTotalHours(String totalHours) {
        this.totalHours = totalHours;
    }

    public Float getKilometre() {
        return this.kilometre;
    }

    public EventServiceMapOrder kilometre(Float kilometre) {
        this.setKilometre(kilometre);
        return this;
    }

    public void setKilometre(Float kilometre) {
        this.kilometre = kilometre;
    }

    public Boolean getBilled() {
        return this.billed;
    }

    public EventServiceMapOrder billed(Boolean billed) {
        this.setBilled(billed);
        return this;
    }

    public void setBilled(Boolean billed) {
        this.billed = billed;
    }

    public Boolean getSeen() {
        return this.seen;
    }

    public EventServiceMapOrder seen(Boolean seen) {
        this.setSeen(seen);
        return this;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }

    public Boolean getApproved() {
        return this.approved;
    }

    public EventServiceMapOrder approved(Boolean approved) {
        this.setApproved(approved);
        return this;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public FeeTransaction getFeeTransaction() {
        return this.feeTransaction;
    }

    public void setFeeTransaction(FeeTransaction feeTransaction) {
        if (this.feeTransaction != null) {
            this.feeTransaction.setEventServiceMapOrder(null);
        }
        if (feeTransaction != null) {
            feeTransaction.setEventServiceMapOrder(this);
        }
        this.feeTransaction = feeTransaction;
    }

    public EventServiceMapOrder feeTransaction(FeeTransaction feeTransaction) {
        this.setFeeTransaction(feeTransaction);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public EventServiceMapOrder event(Event event) {
        this.setEvent(event);
        return this;
    }

    public ServiceMap getServiceMap() {
        return this.serviceMap;
    }

    public void setServiceMap(ServiceMap serviceMap) {
        this.serviceMap = serviceMap;
    }

    public EventServiceMapOrder serviceMap(ServiceMap serviceMap) {
        this.setServiceMap(serviceMap);
        return this;
    }

    public Cart getCart() {
        return this.cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public EventServiceMapOrder cart(Cart cart) {
        this.setCart(cart);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventServiceMapOrder)) {
            return false;
        }
        return id != null && id.equals(((EventServiceMapOrder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventServiceMapOrder{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", dateFrom='" + getDateFrom() + "'" +
            ", dateUntil='" + getDateUntil() + "'" +
            ", costHour=" + getCostHour() +
            ", rideCosts=" + getRideCosts() +
            ", total=" + getTotal() +
            ", totalHours='" + getTotalHours() + "'" +
            ", kilometre=" + getKilometre() +
            ", billed='" + getBilled() + "'" +
            ", seen='" + getSeen() + "'" +
            ", approved='" + getApproved() + "'" +
            "}";
    }
}
