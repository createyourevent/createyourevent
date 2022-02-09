package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ServiceMap.
 */
@Entity
@Table(name = "service_map")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ServiceMap implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @JsonIgnoreProperties(value = { "serviceMap" }, allowSetters = true)
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(unique = true)
    private RideCosts rideCost;

    @OneToMany(mappedBy = "serviceMaps", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "serviceMaps" }, allowSetters = true)
    private Set<ServiceOffer> serviceOffers = new HashSet<>();

    @OneToMany(mappedBy = "serviceMap")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "feeTransaction", "event", "cart" }, allowSetters = true)
    private Set<EventServiceMapOrder> eventServiceMapOrders = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = {  "images", "mp3s", "tags" }, allowSetters = true)
    private CreateYourEventService createYourEventService;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ServiceMap id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public ServiceMap title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public RideCosts getRideCost() {
        return this.rideCost;
    }

    public void setRideCost(RideCosts rideCosts) {
        this.rideCost = rideCosts;
    }

    public ServiceMap rideCost(RideCosts rideCosts) {
        this.setRideCost(rideCosts);
        return this;
    }

    public Set<ServiceOffer> getServiceOffers() {
        return this.serviceOffers;
    }

    public void setServiceOffers(Set<ServiceOffer> serviceOffers) {
        if (this.serviceOffers != null) {
            this.serviceOffers.forEach(i -> i.setServiceMaps(null));
        }
        if (serviceOffers != null) {
            serviceOffers.forEach(i -> i.setServiceMaps(this));
        }
        this.serviceOffers = serviceOffers;
    }

    public ServiceMap serviceOffers(Set<ServiceOffer> serviceOffers) {
        this.setServiceOffers(serviceOffers);
        return this;
    }

    public ServiceMap addServiceOffers(ServiceOffer serviceOffer) {
        this.serviceOffers.add(serviceOffer);
        serviceOffer.setServiceMaps(this);
        return this;
    }

    public ServiceMap removeServiceOffers(ServiceOffer serviceOffer) {
        this.serviceOffers.remove(serviceOffer);
        serviceOffer.setServiceMaps(null);
        return this;
    }

    public Set<EventServiceMapOrder> getEventServiceMapOrders() {
        return this.eventServiceMapOrders;
    }

    public void setEventServiceMapOrders(Set<EventServiceMapOrder> eventServiceMapOrders) {
        if (this.eventServiceMapOrders != null) {
            this.eventServiceMapOrders.forEach(i -> i.setServiceMap(null));
        }
        if (eventServiceMapOrders != null) {
            eventServiceMapOrders.forEach(i -> i.setServiceMap(this));
        }
        this.eventServiceMapOrders = eventServiceMapOrders;
    }

    public ServiceMap eventServiceMapOrders(Set<EventServiceMapOrder> eventServiceMapOrders) {
        this.setEventServiceMapOrders(eventServiceMapOrders);
        return this;
    }

    public ServiceMap addEventServiceMapOrders(EventServiceMapOrder eventServiceMapOrder) {
        this.eventServiceMapOrders.add(eventServiceMapOrder);
        eventServiceMapOrder.setServiceMap(this);
        return this;
    }

    public ServiceMap removeEventServiceMapOrders(EventServiceMapOrder eventServiceMapOrder) {
        this.eventServiceMapOrders.remove(eventServiceMapOrder);
        eventServiceMapOrder.setServiceMap(null);
        return this;
    }

    public CreateYourEventService getCreateYourEventService() {
        return this.createYourEventService;
    }

    public void setCreateYourEventService(CreateYourEventService createYourEventService) {
        this.createYourEventService = createYourEventService;
    }

    public ServiceMap createYourEventService(CreateYourEventService createYourEventService) {
        this.setCreateYourEventService(createYourEventService);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ServiceMap)) {
            return false;
        }
        return id != null && id.equals(((ServiceMap) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ServiceMap{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            "}";
    }
}
