package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.createyourevent.app.domain.enumeration.EventCategory;
import org.createyourevent.app.domain.enumeration.EventStatus;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "date_start", nullable = false)
    private ZonedDateTime dateStart;

    @NotNull
    @Column(name = "date_end", nullable = false)
    private ZonedDateTime dateEnd;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private EventCategory category;

    @NotNull
    @Column(name = "price", nullable = false)
    private Float price;

    @Lob
    @Column(name = "flyer")
    private byte[] flyer;

    @Column(name = "flyer_content_type")
    private String flyerContentType;

    @Column(name = "youtube")
    private String youtube;

    @NotNull
    @Column(name = "private_or_public", nullable = false)
    private String privateOrPublic;

    @Column(name = "active")
    private Boolean active;

    @NotNull
    @Column(name = "min_placenumber", nullable = false)
    private Integer minPlacenumber;

    @NotNull
    @Column(name = "placenumber", nullable = false)
    private Integer placenumber;

    @NotNull
    @Column(name = "investment", nullable = false)
    private Float investment;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EventStatus status;

    @Column(name = "definitely_confirmed")
    private Boolean definitelyConfirmed;

    @NotNull
    @Column(name = "motto", nullable = false)
    private String motto;

    @Column(name = "billed")
    private Boolean billed;

    @Column(name = "stars")
    private Float stars;

    @Column(name = "billed_organisator")
    private Boolean billedOrganisator;

    @Column(name = "billede_create_your_event")
    private Boolean billedeCreateYourEvent;

    @JsonIgnoreProperties(value = { "event" }, allowSetters = true)
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(unique = true)
    private Location location;

    @JsonIgnoreProperties(value = { "event" }, allowSetters = true)
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(unique = true)
    private EventDetails eventDetail;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "feeTransaction", "event", "product", "shop", "cart", "deliveryType" }, allowSetters = true)
    private Set<EventProductOrder> eventProductOrders = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transactionId", "ticket", "user", "event" }, allowSetters = true)
    private Set<Reservation> reservations = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "event", "product" }, allowSetters = true)
    private Set<EventProductRatingComment> comments = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "event", "product" }, allowSetters = true)
    private Set<Worksheet> worksheets = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "feeTransaction", "event", "serviceMap", "cart" }, allowSetters = true)
    private Set<EventServiceMapOrder> eventServiceMapOrders = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product", "shop", "event", "service", "organization" }, allowSetters = true)
    private Set<Image> images = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product", "shop", "event", "service" }, allowSetters = true)
    private Set<Mp3> mp3s = new HashSet<>();

    @ManyToOne
    private User user;

    @ManyToMany
    @JoinTable(
        name = "rel_event__reserved_users",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "reserved_users_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> reservedUsers = new HashSet<>();

    @JsonIgnoreProperties(
        value = { "transactionId", "eventProductOrder", "eventServiceMapOrder", "event", "organizationReservation", "entries", "user" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "event")
    private FeeTransaction feeTransaction;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "event", "product", "shop", "service", "organization" }, allowSetters = true)
    private Set<Tags> tags = new HashSet<>();

    @OneToMany(mappedBy = "event", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "event", "feeTransaction" }, allowSetters = true)
    private Set<OrganizationReservation> organizationReservations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Event id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Event name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Event description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getDateStart() {
        return this.dateStart;
    }

    public Event dateStart(ZonedDateTime dateStart) {
        this.setDateStart(dateStart);
        return this;
    }

    public void setDateStart(ZonedDateTime dateStart) {
        this.dateStart = dateStart;
    }

    public ZonedDateTime getDateEnd() {
        return this.dateEnd;
    }

    public Event dateEnd(ZonedDateTime dateEnd) {
        this.setDateEnd(dateEnd);
        return this;
    }

    public void setDateEnd(ZonedDateTime dateEnd) {
        this.dateEnd = dateEnd;
    }

    public EventCategory getCategory() {
        return this.category;
    }

    public Event category(EventCategory category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(EventCategory category) {
        this.category = category;
    }

    public Float getPrice() {
        return this.price;
    }

    public Event price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public byte[] getFlyer() {
        return this.flyer;
    }

    public Event flyer(byte[] flyer) {
        this.setFlyer(flyer);
        return this;
    }

    public void setFlyer(byte[] flyer) {
        this.flyer = flyer;
    }

    public String getFlyerContentType() {
        return this.flyerContentType;
    }

    public Event flyerContentType(String flyerContentType) {
        this.flyerContentType = flyerContentType;
        return this;
    }

    public void setFlyerContentType(String flyerContentType) {
        this.flyerContentType = flyerContentType;
    }

    public String getYoutube() {
        return this.youtube;
    }

    public Event youtube(String youtube) {
        this.setYoutube(youtube);
        return this;
    }

    public void setYoutube(String youtube) {
        this.youtube = youtube;
    }

    public String getPrivateOrPublic() {
        return this.privateOrPublic;
    }

    public Event privateOrPublic(String privateOrPublic) {
        this.setPrivateOrPublic(privateOrPublic);
        return this;
    }

    public void setPrivateOrPublic(String privateOrPublic) {
        this.privateOrPublic = privateOrPublic;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Event active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getMinPlacenumber() {
        return this.minPlacenumber;
    }

    public Event minPlacenumber(Integer minPlacenumber) {
        this.setMinPlacenumber(minPlacenumber);
        return this;
    }

    public void setMinPlacenumber(Integer minPlacenumber) {
        this.minPlacenumber = minPlacenumber;
    }

    public Integer getPlacenumber() {
        return this.placenumber;
    }

    public Event placenumber(Integer placenumber) {
        this.setPlacenumber(placenumber);
        return this;
    }

    public void setPlacenumber(Integer placenumber) {
        this.placenumber = placenumber;
    }

    public Float getInvestment() {
        return this.investment;
    }

    public Event investment(Float investment) {
        this.setInvestment(investment);
        return this;
    }

    public void setInvestment(Float investment) {
        this.investment = investment;
    }

    public EventStatus getStatus() {
        return this.status;
    }

    public Event status(EventStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public Boolean getDefinitelyConfirmed() {
        return this.definitelyConfirmed;
    }

    public Event definitelyConfirmed(Boolean definitelyConfirmed) {
        this.setDefinitelyConfirmed(definitelyConfirmed);
        return this;
    }

    public void setDefinitelyConfirmed(Boolean definitelyConfirmed) {
        this.definitelyConfirmed = definitelyConfirmed;
    }

    public String getMotto() {
        return this.motto;
    }

    public Event motto(String motto) {
        this.setMotto(motto);
        return this;
    }

    public void setMotto(String motto) {
        this.motto = motto;
    }

    public Boolean getBilled() {
        return this.billed;
    }

    public Event billed(Boolean billed) {
        this.setBilled(billed);
        return this;
    }

    public void setBilled(Boolean billed) {
        this.billed = billed;
    }

    public Float getStars() {
        return this.stars;
    }

    public Event stars(Float stars) {
        this.setStars(stars);
        return this;
    }

    public void setStars(Float stars) {
        this.stars = stars;
    }

    public Boolean getBilledOrganisator() {
        return this.billedOrganisator;
    }

    public Event billedOrganisator(Boolean billedOrganisator) {
        this.setBilledOrganisator(billedOrganisator);
        return this;
    }

    public void setBilledOrganisator(Boolean billedOrganisator) {
        this.billedOrganisator = billedOrganisator;
    }

    public Boolean getBilledeCreateYourEvent() {
        return this.billedeCreateYourEvent;
    }

    public Event billedeCreateYourEvent(Boolean billedeCreateYourEvent) {
        this.setBilledeCreateYourEvent(billedeCreateYourEvent);
        return this;
    }

    public void setBilledeCreateYourEvent(Boolean billedeCreateYourEvent) {
        this.billedeCreateYourEvent = billedeCreateYourEvent;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Event location(Location location) {
        this.setLocation(location);
        return this;
    }

    public EventDetails getEventDetail() {
        return this.eventDetail;
    }

    public void setEventDetail(EventDetails eventDetails) {
        this.eventDetail = eventDetails;
    }

    public Event eventDetail(EventDetails eventDetails) {
        this.setEventDetail(eventDetails);
        return this;
    }

    public Set<EventProductOrder> getEventProductOrders() {
        return this.eventProductOrders;
    }

    public void setEventProductOrders(Set<EventProductOrder> eventProductOrders) {
        if (this.eventProductOrders != null) {
            this.eventProductOrders.forEach(i -> i.setEvent(null));
        }
        if (eventProductOrders != null) {
            eventProductOrders.forEach(i -> i.setEvent(this));
        }
        this.eventProductOrders = eventProductOrders;
    }

    public Event eventProductOrders(Set<EventProductOrder> eventProductOrders) {
        this.setEventProductOrders(eventProductOrders);
        return this;
    }

    public Event addEventProductOrders(EventProductOrder eventProductOrder) {
        this.eventProductOrders.add(eventProductOrder);
        eventProductOrder.setEvent(this);
        return this;
    }

    public Event removeEventProductOrders(EventProductOrder eventProductOrder) {
        this.eventProductOrders.remove(eventProductOrder);
        eventProductOrder.setEvent(null);
        return this;
    }

    public Set<Reservation> getReservations() {
        return this.reservations;
    }

    public void setReservations(Set<Reservation> reservations) {
        if (this.reservations != null) {
            this.reservations.forEach(i -> i.setEvent(null));
        }
        if (reservations != null) {
            reservations.forEach(i -> i.setEvent(this));
        }
        this.reservations = reservations;
    }

    public Event reservations(Set<Reservation> reservations) {
        this.setReservations(reservations);
        return this;
    }

    public Event addReservations(Reservation reservation) {
        this.reservations.add(reservation);
        reservation.setEvent(this);
        return this;
    }

    public Event removeReservations(Reservation reservation) {
        this.reservations.remove(reservation);
        reservation.setEvent(null);
        return this;
    }

    public Set<EventProductRatingComment> getComments() {
        return this.comments;
    }

    public void setComments(Set<EventProductRatingComment> eventProductRatingComments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setEvent(null));
        }
        if (eventProductRatingComments != null) {
            eventProductRatingComments.forEach(i -> i.setEvent(this));
        }
        this.comments = eventProductRatingComments;
    }

    public Event comments(Set<EventProductRatingComment> eventProductRatingComments) {
        this.setComments(eventProductRatingComments);
        return this;
    }

    public Event addComments(EventProductRatingComment eventProductRatingComment) {
        this.comments.add(eventProductRatingComment);
        eventProductRatingComment.setEvent(this);
        return this;
    }

    public Event removeComments(EventProductRatingComment eventProductRatingComment) {
        this.comments.remove(eventProductRatingComment);
        eventProductRatingComment.setEvent(null);
        return this;
    }

    public Set<Worksheet> getWorksheets() {
        return this.worksheets;
    }

    public void setWorksheets(Set<Worksheet> worksheets) {
        if (this.worksheets != null) {
            this.worksheets.forEach(i -> i.setEvent(null));
        }
        if (worksheets != null) {
            worksheets.forEach(i -> i.setEvent(this));
        }
        this.worksheets = worksheets;
    }

    public Event worksheets(Set<Worksheet> worksheets) {
        this.setWorksheets(worksheets);
        return this;
    }

    public Event addWorksheets(Worksheet worksheet) {
        this.worksheets.add(worksheet);
        worksheet.setEvent(this);
        return this;
    }

    public Event removeWorksheets(Worksheet worksheet) {
        this.worksheets.remove(worksheet);
        worksheet.setEvent(null);
        return this;
    }

    public Set<EventServiceMapOrder> getEventServiceMapOrders() {
        return this.eventServiceMapOrders;
    }

    public void setEventServiceMapOrders(Set<EventServiceMapOrder> eventServiceMapOrders) {
        if (this.eventServiceMapOrders != null) {
            this.eventServiceMapOrders.forEach(i -> i.setEvent(null));
        }
        if (eventServiceMapOrders != null) {
            eventServiceMapOrders.forEach(i -> i.setEvent(this));
        }
        this.eventServiceMapOrders = eventServiceMapOrders;
    }

    public Event eventServiceMapOrders(Set<EventServiceMapOrder> eventServiceMapOrders) {
        this.setEventServiceMapOrders(eventServiceMapOrders);
        return this;
    }

    public Event addEventServiceMapOrders(EventServiceMapOrder eventServiceMapOrder) {
        this.eventServiceMapOrders.add(eventServiceMapOrder);
        eventServiceMapOrder.setEvent(this);
        return this;
    }

    public Event removeEventServiceMapOrders(EventServiceMapOrder eventServiceMapOrder) {
        this.eventServiceMapOrders.remove(eventServiceMapOrder);
        eventServiceMapOrder.setEvent(null);
        return this;
    }

    public Set<Image> getImages() {
        return this.images;
    }

    public void setImages(Set<Image> images) {
        if (this.images != null) {
            this.images.forEach(i -> i.setEvent(null));
        }
        if (images != null) {
            images.forEach(i -> i.setEvent(this));
        }
        this.images = images;
    }

    public Event images(Set<Image> images) {
        this.setImages(images);
        return this;
    }

    public Event addImages(Image image) {
        this.images.add(image);
        image.setEvent(this);
        return this;
    }

    public Event removeImages(Image image) {
        this.images.remove(image);
        image.setEvent(null);
        return this;
    }

    public Set<Mp3> getMp3s() {
        return this.mp3s;
    }

    public void setMp3s(Set<Mp3> mp3s) {
        if (this.mp3s != null) {
            this.mp3s.forEach(i -> i.setEvent(null));
        }
        if (mp3s != null) {
            mp3s.forEach(i -> i.setEvent(this));
        }
        this.mp3s = mp3s;
    }

    public Event mp3s(Set<Mp3> mp3s) {
        this.setMp3s(mp3s);
        return this;
    }

    public Event addMp3s(Mp3 mp3) {
        this.mp3s.add(mp3);
        mp3.setEvent(this);
        return this;
    }

    public Event removeMp3s(Mp3 mp3) {
        this.mp3s.remove(mp3);
        mp3.setEvent(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Event user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<User> getReservedUsers() {
        return this.reservedUsers;
    }

    public void setReservedUsers(Set<User> users) {
        this.reservedUsers = users;
    }

    public Event reservedUsers(Set<User> users) {
        this.setReservedUsers(users);
        return this;
    }

    public Event addReservedUsers(User user) {
        this.reservedUsers.add(user);
        return this;
    }

    public Event removeReservedUsers(User user) {
        this.reservedUsers.remove(user);
        return this;
    }

    public FeeTransaction getFeeTransaction() {
        return this.feeTransaction;
    }

    public void setFeeTransaction(FeeTransaction feeTransaction) {
        if (this.feeTransaction != null) {
            this.feeTransaction.setEvent(null);
        }
        if (feeTransaction != null) {
            feeTransaction.setEvent(this);
        }
        this.feeTransaction = feeTransaction;
    }

    public Event feeTransaction(FeeTransaction feeTransaction) {
        this.setFeeTransaction(feeTransaction);
        return this;
    }

    public Set<Tags> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tags> tags) {
        if (this.tags != null) {
            this.tags.forEach(i -> i.setEvent(null));
        }
        if (tags != null) {
            tags.forEach(i -> i.setEvent(this));
        }
        this.tags = tags;
    }

    public Event tags(Set<Tags> tags) {
        this.setTags(tags);
        return this;
    }

    public Event addTags(Tags tags) {
        this.tags.add(tags);
        tags.setEvent(this);
        return this;
    }

    public Event removeTags(Tags tags) {
        this.tags.remove(tags);
        tags.setEvent(null);
        return this;
    }

    public Set<OrganizationReservation> getOrganizationReservations() {
        return this.organizationReservations;
    }

    public void setOrganizationReservations(Set<OrganizationReservation> organizationReservations) {
        if (this.organizationReservations != null) {
            this.organizationReservations.forEach(i -> i.setEvent(null));
        }
        if (organizationReservations != null) {
            organizationReservations.forEach(i -> i.setEvent(this));
        }
        this.organizationReservations = organizationReservations;
    }

    public Event organizationReservations(Set<OrganizationReservation> organizationReservations) {
        this.setOrganizationReservations(organizationReservations);
        return this;
    }

    public Event addOrganizationReservations(OrganizationReservation organizationReservation) {
        this.organizationReservations.add(organizationReservation);
        organizationReservation.setEvent(this);
        return this;
    }

    public Event removeOrganizationReservations(OrganizationReservation organizationReservation) {
        this.organizationReservations.remove(organizationReservation);
        organizationReservation.setEvent(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return id != null && id.equals(((Event) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateStart='" + getDateStart() + "'" +
            ", dateEnd='" + getDateEnd() + "'" +
            ", category='" + getCategory() + "'" +
            ", price=" + getPrice() +
            ", flyer='" + getFlyer() + "'" +
            ", flyerContentType='" + getFlyerContentType() + "'" +
            ", youtube='" + getYoutube() + "'" +
            ", privateOrPublic='" + getPrivateOrPublic() + "'" +
            ", active='" + getActive() + "'" +
            ", minPlacenumber=" + getMinPlacenumber() +
            ", placenumber=" + getPlacenumber() +
            ", investment=" + getInvestment() +
            ", status='" + getStatus() + "'" +
            ", definitelyConfirmed='" + getDefinitelyConfirmed() + "'" +
            ", motto='" + getMotto() + "'" +
            ", billed='" + getBilled() + "'" +
            ", stars=" + getStars() +
            ", billedOrganisator='" + getBilledOrganisator() + "'" +
            ", billedeCreateYourEvent='" + getBilledeCreateYourEvent() + "'" +
            "}";
    }
}
