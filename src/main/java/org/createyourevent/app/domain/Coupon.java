package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Coupon.
 */
@Entity
@Table(name = "coupon")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Coupon implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "value")
    private Float value;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "coupon_nr")
    private String couponNr;

    @Column(name = "used")
    private Boolean used;

    @ManyToOne
    private User user;

    @ManyToOne
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

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Coupon id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Coupon title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Float getValue() {
        return this.value;
    }

    public Coupon value(Float value) {
        this.setValue(value);
        return this;
    }

    public void setValue(Float value) {
        this.value = value;
    }

    public String getDescription() {
        return this.description;
    }

    public Coupon description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCouponNr() {
        return this.couponNr;
    }

    public Coupon couponNr(String couponNr) {
        this.setCouponNr(couponNr);
        return this;
    }

    public void setCouponNr(String couponNr) {
        this.couponNr = couponNr;
    }

    public Boolean getUsed() {
        return this.used;
    }

    public Coupon used(Boolean used) {
        this.setUsed(used);
        return this;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Coupon user(User user) {
        this.setUser(user);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Coupon event(Event event) {
        this.setEvent(event);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Coupon)) {
            return false;
        }
        return id != null && id.equals(((Coupon) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Coupon{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", value=" + getValue() +
            ", description='" + getDescription() + "'" +
            ", couponNr='" + getCouponNr() + "'" +
            ", used='" + getUsed() + "'" +
            "}";
    }
}
