package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Mp3.
 */
@Entity
@Table(name = "mp_3")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Mp3 implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "artists")
    private String artists;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "url")
    private String url;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "eventProductOrders", "comments", "worksheets", "images", "mp3s", "shop", "tags", "deliveryTypes" },
        allowSetters = true
    )
    private Product product;

    @ManyToOne
    @JsonIgnoreProperties(value = { "products", "eventProductOrders", "images", "mp3s", "user", "comments", "tags" }, allowSetters = true)
    private Shop shop;

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

    @ManyToOne
    @JsonIgnoreProperties(value = { "serviceMaps", "images", "mp3s", "user", "tags" }, allowSetters = true)
    private CreateYourEventService service;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Mp3 id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Mp3 title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtists() {
        return this.artists;
    }

    public Mp3 artists(String artists) {
        this.setArtists(artists);
        return this;
    }

    public void setArtists(String artists) {
        this.artists = artists;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Mp3 duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getUrl() {
        return this.url;
    }

    public Mp3 url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Mp3 user(User user) {
        this.setUser(user);
        return this;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Mp3 product(Product product) {
        this.setProduct(product);
        return this;
    }

    public Shop getShop() {
        return this.shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Mp3 shop(Shop shop) {
        this.setShop(shop);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Mp3 event(Event event) {
        this.setEvent(event);
        return this;
    }

    public CreateYourEventService getService() {
        return this.service;
    }

    public void setService(CreateYourEventService createYourEventService) {
        this.service = createYourEventService;
    }

    public Mp3 service(CreateYourEventService createYourEventService) {
        this.setService(createYourEventService);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mp3)) {
            return false;
        }
        return id != null && id.equals(((Mp3) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mp3{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", artists='" + getArtists() + "'" +
            ", duration=" + getDuration() +
            ", url='" + getUrl() + "'" +
            "}";
    }
}
