package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.createyourevent.app.domain.enumeration.DeliveryTypes;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DeliveryType.
 */
@Entity
@Table(name = "delivery_type")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DeliveryType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_type")
    private DeliveryTypes deliveryType;

    @Column(name = "minimum_order_quantity")
    private Float minimumOrderQuantity;

    @Column(name = "price")
    private Float price;

    @Column(name = "price_per_kilometre")
    private Float pricePerKilometre;

    @OneToMany(mappedBy = "deliveryType")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "feeTransaction", "event", "product", "shop", "cart", "deliveryType" }, allowSetters = true)
    private Set<EventProductOrder> eventProductOrders = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "eventProductOrders", "comments", "worksheets", "images", "mp3s", "shop", "tags", "deliveryTypes" },
        allowSetters = true
    )
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DeliveryType id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DeliveryTypes getDeliveryType() {
        return this.deliveryType;
    }

    public DeliveryType deliveryType(DeliveryTypes deliveryType) {
        this.setDeliveryType(deliveryType);
        return this;
    }

    public void setDeliveryType(DeliveryTypes deliveryType) {
        this.deliveryType = deliveryType;
    }

    public Float getMinimumOrderQuantity() {
        return this.minimumOrderQuantity;
    }

    public DeliveryType minimumOrderQuantity(Float minimumOrderQuantity) {
        this.setMinimumOrderQuantity(minimumOrderQuantity);
        return this;
    }

    public void setMinimumOrderQuantity(Float minimumOrderQuantity) {
        this.minimumOrderQuantity = minimumOrderQuantity;
    }

    public Float getPrice() {
        return this.price;
    }

    public DeliveryType price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Float getPricePerKilometre() {
        return this.pricePerKilometre;
    }

    public DeliveryType pricePerKilometre(Float pricePerKilometre) {
        this.setPricePerKilometre(pricePerKilometre);
        return this;
    }

    public void setPricePerKilometre(Float pricePerKilometre) {
        this.pricePerKilometre = pricePerKilometre;
    }

    public Set<EventProductOrder> getEventProductOrders() {
        return this.eventProductOrders;
    }

    public void setEventProductOrders(Set<EventProductOrder> eventProductOrders) {
        if (this.eventProductOrders != null) {
            this.eventProductOrders.forEach(i -> i.setDeliveryType(null));
        }
        if (eventProductOrders != null) {
            eventProductOrders.forEach(i -> i.setDeliveryType(this));
        }
        this.eventProductOrders = eventProductOrders;
    }

    public DeliveryType eventProductOrders(Set<EventProductOrder> eventProductOrders) {
        this.setEventProductOrders(eventProductOrders);
        return this;
    }

    public DeliveryType addEventProductOrders(EventProductOrder eventProductOrder) {
        this.eventProductOrders.add(eventProductOrder);
        eventProductOrder.setDeliveryType(this);
        return this;
    }

    public DeliveryType removeEventProductOrders(EventProductOrder eventProductOrder) {
        this.eventProductOrders.remove(eventProductOrder);
        eventProductOrder.setDeliveryType(null);
        return this;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public DeliveryType product(Product product) {
        this.setProduct(product);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DeliveryType)) {
            return false;
        }
        return id != null && id.equals(((DeliveryType) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DeliveryType{" +
            "id=" + getId() +
            ", deliveryType='" + getDeliveryType() + "'" +
            ", minimumOrderQuantity=" + getMinimumOrderQuantity() +
            ", price=" + getPrice() +
            ", pricePerKilometre=" + getPricePerKilometre() +
            "}";
    }
}
