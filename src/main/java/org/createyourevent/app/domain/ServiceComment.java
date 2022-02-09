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
 * A ServiceComment.
 */
@Entity
@Table(name = "service_comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ServiceComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "comment")
    private String comment;

    @Column(name = "date")
    private ZonedDateTime date;

    @OneToMany(mappedBy = "serviceComment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "serviceComments", "createYourEventService", "user", "serviceComment" }, allowSetters = true)
    private Set<ServiceComment> serviceComments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "serviceMaps", "images", "mp3s", "user", "tags" }, allowSetters = true)
    private CreateYourEventService createYourEventService;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "serviceComments", "createYourEventService", "user", "serviceComment" }, allowSetters = true)
    private ServiceComment serviceComment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ServiceComment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return this.comment;
    }

    public ServiceComment comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public ServiceComment date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Set<ServiceComment> getServiceComments() {
        return this.serviceComments;
    }

    public void setServiceComments(Set<ServiceComment> serviceComments) {
        if (this.serviceComments != null) {
            this.serviceComments.forEach(i -> i.setServiceComment(null));
        }
        if (serviceComments != null) {
            serviceComments.forEach(i -> i.setServiceComment(this));
        }
        this.serviceComments = serviceComments;
    }

    public ServiceComment serviceComments(Set<ServiceComment> serviceComments) {
        this.setServiceComments(serviceComments);
        return this;
    }

    public ServiceComment addServiceComments(ServiceComment serviceComment) {
        this.serviceComments.add(serviceComment);
        serviceComment.setServiceComment(this);
        return this;
    }

    public ServiceComment removeServiceComments(ServiceComment serviceComment) {
        this.serviceComments.remove(serviceComment);
        serviceComment.setServiceComment(null);
        return this;
    }

    public CreateYourEventService getCreateYourEventService() {
        return this.createYourEventService;
    }

    public void setCreateYourEventService(CreateYourEventService createYourEventService) {
        this.createYourEventService = createYourEventService;
    }

    public ServiceComment createYourEventService(CreateYourEventService createYourEventService) {
        this.setCreateYourEventService(createYourEventService);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ServiceComment user(User user) {
        this.setUser(user);
        return this;
    }

    public ServiceComment getServiceComment() {
        return this.serviceComment;
    }

    public void setServiceComment(ServiceComment serviceComment) {
        this.serviceComment = serviceComment;
    }

    public ServiceComment serviceComment(ServiceComment serviceComment) {
        this.setServiceComment(serviceComment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ServiceComment)) {
            return false;
        }
        return id != null && id.equals(((ServiceComment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ServiceComment{" +
            "id=" + getId() +
            ", comment='" + getComment() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
