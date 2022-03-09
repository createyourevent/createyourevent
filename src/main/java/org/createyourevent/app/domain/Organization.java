package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.createyourevent.app.domain.enumeration.OrganizationType;
import org.createyourevent.app.domain.enumeration.RentType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Organization.
 */
@Entity
@Table(name = "organization")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Organization implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "organization_type", nullable = false)
    private OrganizationType organizationType;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "active_owner")
    private Boolean activeOwner;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Column(name = "motto", nullable = false)
    private String motto;

    @NotNull
    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "web_address")
    private String webAddress;

    @Column(name = "place_number")
    private Integer placeNumber;

    @Column(name = "price")
    private Float price;

    @Enumerated(EnumType.STRING)
    @Column(name = "rent_type")
    private RentType rentType;

    @Column(name = "rentable")
    private Boolean rentable;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product", "shop", "event", "service", "organization" }, allowSetters = true)
    private Set<Image> images = new HashSet<>();

    @OneToMany(mappedBy = "organization", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "events", "organization" }, allowSetters = true)
    private Set<OrganizationReservation> organizationReservations = new HashSet<>();

    @ManyToOne
    private User user;

    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    @OneToOne(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Restaurant restaurant;

    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    @OneToOne(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Hotel hotel;

    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    @OneToOne(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Club club;

    @JsonIgnoreProperties(value = {}, allowSetters = true)
    @OneToOne(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Building building;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "event", "product", "shop", "service", "organization" }, allowSetters = true)
    private Set<Tags> tags = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Organization id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Organization name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public OrganizationType getOrganizationType() {
        return this.organizationType;
    }

    public Organization organizationType(OrganizationType organizationType) {
        this.setOrganizationType(organizationType);
        return this;
    }

    public void setOrganizationType(OrganizationType organizationType) {
        this.organizationType = organizationType;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public Organization logo(byte[] logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public Organization logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Organization active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getActiveOwner() {
        return this.activeOwner;
    }

    public Organization activeOwner(Boolean activeOwner) {
        this.setActiveOwner(activeOwner);
        return this;
    }

    public void setActiveOwner(Boolean activeOwner) {
        this.activeOwner = activeOwner;
    }

    public String getDescription() {
        return this.description;
    }

    public Organization description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return this.address;
    }

    public Organization address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMotto() {
        return this.motto;
    }

    public Organization motto(String motto) {
        this.setMotto(motto);
        return this;
    }

    public void setMotto(String motto) {
        this.motto = motto;
    }

    public String getPhone() {
        return this.phone;
    }

    public Organization phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWebAddress() {
        return this.webAddress;
    }

    public Organization webAddress(String webAddress) {
        this.setWebAddress(webAddress);
        return this;
    }

    public void setWebAddress(String webAddress) {
        this.webAddress = webAddress;
    }

    public Integer getPlaceNumber() {
        return this.placeNumber;
    }

    public Organization placeNumber(Integer placeNumber) {
        this.setPlaceNumber(placeNumber);
        return this;
    }

    public void setPlaceNumber(Integer placeNumber) {
        this.placeNumber = placeNumber;
    }

    public Float getPrice() {
        return this.price;
    }

    public Organization price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public RentType getRentType() {
        return this.rentType;
    }

    public Organization rentType(RentType rentType) {
        this.setRentType(rentType);
        return this;
    }

    public void setRentType(RentType rentType) {
        this.rentType = rentType;
    }

    public Boolean getRentable() {
        return this.rentable;
    }

    public Organization rentable(Boolean rentable) {
        this.setRentable(rentable);
        return this;
    }

    public void setRentable(Boolean rentable) {
        this.rentable = rentable;
    }

    public Set<Image> getImages() {
        return this.images;
    }

    public void setImages(Set<Image> images) {
        if (this.images != null) {
            this.images.forEach(i -> i.setOrganization(null));
        }
        if (images != null) {
            images.forEach(i -> i.setOrganization(this));
        }
        this.images = images;
    }

    public Organization images(Set<Image> images) {
        this.setImages(images);
        return this;
    }

    public Organization addImages(Image image) {
        this.images.add(image);
        image.setOrganization(this);
        return this;
    }

    public Organization removeImages(Image image) {
        this.images.remove(image);
        image.setOrganization(null);
        return this;
    }

    public Set<OrganizationReservation> getOrganizationReservations() {
        return this.organizationReservations;
    }

    public void setOrganizationReservations(Set<OrganizationReservation> organizationReservations) {
        if (this.organizationReservations != null) {
            this.organizationReservations.forEach(i -> i.setOrganization(null));
        }
        if (organizationReservations != null) {
            organizationReservations.forEach(i -> i.setOrganization(this));
        }
        this.organizationReservations = organizationReservations;
    }

    public Organization organizationReservations(Set<OrganizationReservation> organizationReservations) {
        this.setOrganizationReservations(organizationReservations);
        return this;
    }

    public Organization addOrganizationReservations(OrganizationReservation organizationReservation) {
        this.organizationReservations.add(organizationReservation);
        organizationReservation.setOrganization(this);
        return this;
    }

    public Organization removeOrganizationReservations(OrganizationReservation organizationReservation) {
        this.organizationReservations.remove(organizationReservation);
        organizationReservation.setOrganization(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Organization user(User user) {
        this.setUser(user);
        return this;
    }

    public Restaurant getRestaurant() {
        return this.restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        if (this.restaurant != null) {
            this.restaurant.setOrganization(null);
        }
        if (restaurant != null) {
            restaurant.setOrganization(this);
        }
        this.restaurant = restaurant;
    }

    public Organization restaurant(Restaurant restaurant) {
        this.setRestaurant(restaurant);
        return this;
    }

    public Hotel getHotel() {
        return this.hotel;
    }

    public void setHotel(Hotel hotel) {
        if (this.hotel != null) {
            this.hotel.setOrganization(null);
        }
        if (hotel != null) {
            hotel.setOrganization(this);
        }
        this.hotel = hotel;
    }

    public Organization hotel(Hotel hotel) {
        this.setHotel(hotel);
        return this;
    }

    public Club getClub() {
        return this.club;
    }

    public void setClub(Club club) {
        if (this.club != null) {
            this.club.setOrganization(null);
        }
        if (club != null) {
            club.setOrganization(this);
        }
        this.club = club;
    }

    public Organization club(Club club) {
        this.setClub(club);
        return this;
    }

    public Building getBuilding() {
        return this.building;
    }

    public void setBuilding(Building building) {
        if (this.building != null) {
            this.building.setOrganization(null);
        }
        if (building != null) {
            building.setOrganization(this);
        }
        this.building = building;
    }

    public Organization building(Building building) {
        this.setBuilding(building);
        return this;
    }

    public Set<Tags> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tags> tags) {
        if (this.tags != null) {
            this.tags.forEach(i -> i.setOrganization(null));
        }
        if (tags != null) {
            tags.forEach(i -> i.setOrganization(this));
        }
        this.tags = tags;
    }

    public Organization tags(Set<Tags> tags) {
        this.setTags(tags);
        return this;
    }

    public Organization addTags(Tags tags) {
        this.tags.add(tags);
        tags.setOrganization(this);
        return this;
    }

    public Organization removeTags(Tags tags) {
        this.tags.remove(tags);
        tags.setOrganization(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Organization)) {
            return false;
        }
        return id != null && id.equals(((Organization) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Organization{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", organizationType='" + getOrganizationType() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", active='" + getActive() + "'" +
            ", activeOwner='" + getActiveOwner() + "'" +
            ", description='" + getDescription() + "'" +
            ", address='" + getAddress() + "'" +
            ", motto='" + getMotto() + "'" +
            ", phone='" + getPhone() + "'" +
            ", webAddress='" + getWebAddress() + "'" +
            ", placeNumber=" + getPlaceNumber() +
            ", price=" + getPrice() +
            ", rentType='" + getRentType() + "'" +
            ", rentable='" + getRentable() + "'" +
            "}";
    }
}
