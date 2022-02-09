package org.createyourevent.app.domain;

import java.time.ZonedDateTime;

public class ReservationFirestore {

    private Long id;

    private Boolean accessEvent;

    private ZonedDateTime accessDate;

    private Long eventId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAccessEvent() {
        return accessEvent;
    }

    public void setAccessEvent(Boolean accessEvent) {
        this.accessEvent = accessEvent;
    }

    public ZonedDateTime getAccessDate() {
        return accessDate;
    }

    public void setAccessDate(ZonedDateTime accessDate) {
        this.accessDate = accessDate;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }



}
