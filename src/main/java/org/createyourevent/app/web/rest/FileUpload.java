package org.createyourevent.app.web.rest;

import java.io.File;
import java.net.InetAddress;
import java.util.Arrays;
import java.util.Optional;

import org.createyourevent.app.domain.CreateYourEventService;
import org.createyourevent.app.domain.Event;
import org.createyourevent.app.domain.Image;
import org.createyourevent.app.domain.Mp3;
import org.createyourevent.app.domain.Organization;
import org.createyourevent.app.domain.Product;
import org.createyourevent.app.domain.Shop;
import org.createyourevent.app.domain.User;
import org.createyourevent.app.repository.CreateYourEventServiceRepository;
import org.createyourevent.app.repository.EventRepository;
import org.createyourevent.app.repository.OrganizationRepository;
import org.createyourevent.app.repository.ProductRepository;
import org.createyourevent.app.repository.ShopRepository;
import org.createyourevent.app.repository.UserRepository;
import org.createyourevent.app.service.ImageService;
import org.createyourevent.app.service.Mp3Service;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.CannotWriteException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.jsonwebtoken.io.IOException;

@RestController
@RequestMapping("/api")
public class FileUpload {

    private final Logger log = LoggerFactory.getLogger(FileUpload.class);

    @Value("${server.port}")
    int aPort;

    private ImageService imageService;
    private ProductRepository productRepository;
    private UserRepository userRepository;
    private ShopRepository shopRepository;
    private EventRepository eventRepository;
    private OrganizationRepository organizationRepository;
    private CreateYourEventServiceRepository serviceRepository;
    private Mp3Service mp3Service;

    public FileUpload(ImageService imageService,
                      ProductRepository productRepository,
                      UserRepository userRepository,
                      ShopRepository shopRepository,
                      EventRepository eventRepository,
                      CreateYourEventServiceRepository serviceRepository,
                      Mp3Service mp3Service,
                      OrganizationRepository organizationRepository) {
        this.imageService = imageService;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.eventRepository = eventRepository;
        this.serviceRepository = serviceRepository;
        this.mp3Service = mp3Service;
        this.organizationRepository = organizationRepository;
    }


    @RequestMapping(value = "/upload/{productId}/{userId}/product", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadProduct(@RequestParam("files") MultipartFile[] files, @PathVariable Long productId, @PathVariable String userId) throws IOException {
        Optional<Product> product = this.productRepository.findById(productId);
        Optional<User> user = this.userRepository.findById(userId);
        try {
            for(MultipartFile file : files) {
                Image image = new Image();
                image.setImage(file.getBytes());
                image.setImageContentType(file.getContentType());
                image.setName(file.getOriginalFilename());
                image.setProduct(product.get());
                image.setUser(user.get());
                imageService.save(image);
            }
        } catch (java.io.IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/upload/{shopId}/{userId}/shop", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadShop(@RequestParam("files") MultipartFile[] files, @PathVariable Long shopId, @PathVariable String userId) throws IOException {
        Optional<Shop> shop = this.shopRepository.findById(shopId);
        Optional<User> user = this.userRepository.findById(userId);
        try {
            for(MultipartFile file : files) {
                Image image = new Image();
                image.setImage(file.getBytes());
                image.setImageContentType(file.getContentType());
                image.setName(file.getOriginalFilename());
                image.setShop(shop.get());
                image.setUser(user.get());
                imageService.save(image);
            }
        } catch (java.io.IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/upload/{eventId}/{userId}/event", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadEvent(@RequestParam("files") MultipartFile[] files, @PathVariable Long eventId, @PathVariable String userId) throws IOException {
        Optional<Event> event = this.eventRepository.findById(eventId);
        Optional<User> user = this.userRepository.findById(userId);
        try {
            for(MultipartFile file : files) {
                Image image = new Image();
                image.setImage(file.getBytes());
                image.setImageContentType(file.getContentType());
                image.setName(file.getOriginalFilename());
                image.setEvent(event.get());
                image.setUser(user.get());
                imageService.save(image);
            }
        } catch (java.io.IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/upload/{serviceId}/{userId}/service", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadService(@RequestParam("files") MultipartFile[] files, @PathVariable Long serviceId, @PathVariable String userId) throws IOException {
        Optional<CreateYourEventService> service = this.serviceRepository.findById(serviceId);
        Optional<User> user = this.userRepository.findById(userId);
        try {
            for(MultipartFile file : files) {
                Image image = new Image();
                image.setImage(file.getBytes());
                image.setImageContentType(file.getContentType());
                image.setName(file.getOriginalFilename());
                image.setService(service.get());
                image.setUser(user.get());
                imageService.save(image);
            }
        } catch (java.io.IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/upload/{organizationId}/{userId}/organization", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadOrganization(@RequestParam("files") MultipartFile[] files, @PathVariable Long organizationId, @PathVariable String userId) throws IOException {
        Optional<Organization> organization = this.organizationRepository.findById(organizationId);
        Optional<User> user = this.userRepository.findById(userId);
        try {
            for(MultipartFile file : files) {
                Image image = new Image();
                image.setImage(file.getBytes());
                image.setImageContentType(file.getContentType());
                image.setName(file.getOriginalFilename());
                image.setOrganization(organization.get());
                image.setUser(user.get());
                imageService.save(image);
            }
        } catch (java.io.IOException e) {
            e.printStackTrace();
        }
    }

}
