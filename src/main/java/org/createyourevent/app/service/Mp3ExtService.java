package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Mp3;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Mp3}.
 */
public interface Mp3ExtService {
    List<Mp3> findByUserIdAndServiceId(String userId, Long serviceId);
    List<Mp3> findByService(Long serviceId);
    List<Mp3> findByUserIdAndProductId(String userId, Long productId);
    List<Mp3> findByProductId(Long productId);
    List<Mp3> findByUserIdAndEventId(String userId, Long eventId);
    List<Mp3> findByUserIdAndShopId(String userId, Long shopId);
    List<Mp3> findByEventId(Long eventId);
    List<Mp3> findByShopId(Long shopId);
}
