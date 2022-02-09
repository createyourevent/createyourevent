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
 * A Cart.
 */
@Entity
@Table(name = "cart")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Cart implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "total_costs")
    private Float totalCosts;

    @OneToMany(mappedBy = "cart")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "feeTransaction", "event", "product", "shop", "cart", "deliveryType" }, allowSetters = true)
    private Set<EventProductOrder> products = new HashSet<>();

    @OneToMany(mappedBy = "cart")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "feeTransaction", "event", "serviceMap", "cart" }, allowSetters = true)
    private Set<EventServiceMapOrder> services = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Cart id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Cart date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Float getTotalCosts() {
        return this.totalCosts;
    }

    public Cart totalCosts(Float totalCosts) {
        this.setTotalCosts(totalCosts);
        return this;
    }

    public void setTotalCosts(Float totalCosts) {
        this.totalCosts = totalCosts;
    }

    public Set<EventProductOrder> getProducts() {
        return this.products;
    }

    public void setProducts(Set<EventProductOrder> eventProductOrders) {
        if (this.products != null) {
            this.products.forEach(i -> i.setCart(null));
        }
        if (eventProductOrders != null) {
            eventProductOrders.forEach(i -> i.setCart(this));
        }
        this.products = eventProductOrders;
    }

    public Cart products(Set<EventProductOrder> eventProductOrders) {
        this.setProducts(eventProductOrders);
        return this;
    }

    public Cart addProducts(EventProductOrder eventProductOrder) {
        this.products.add(eventProductOrder);
        eventProductOrder.setCart(this);
        return this;
    }

    public Cart removeProducts(EventProductOrder eventProductOrder) {
        this.products.remove(eventProductOrder);
        eventProductOrder.setCart(null);
        return this;
    }

    public Set<EventServiceMapOrder> getServices() {
        return this.services;
    }

    public void setServices(Set<EventServiceMapOrder> eventServiceMapOrders) {
        if (this.services != null) {
            this.services.forEach(i -> i.setCart(null));
        }
        if (eventServiceMapOrders != null) {
            eventServiceMapOrders.forEach(i -> i.setCart(this));
        }
        this.services = eventServiceMapOrders;
    }

    public Cart services(Set<EventServiceMapOrder> eventServiceMapOrders) {
        this.setServices(eventServiceMapOrders);
        return this;
    }

    public Cart addServices(EventServiceMapOrder eventServiceMapOrder) {
        this.services.add(eventServiceMapOrder);
        eventServiceMapOrder.setCart(this);
        return this;
    }

    public Cart removeServices(EventServiceMapOrder eventServiceMapOrder) {
        this.services.remove(eventServiceMapOrder);
        eventServiceMapOrder.setCart(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cart)) {
            return false;
        }
        return id != null && id.equals(((Cart) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cart{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", totalCosts=" + getTotalCosts() +
            "}";
    }
}
