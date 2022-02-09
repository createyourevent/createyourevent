package org.createyourevent.app.web.rest;

import java.io.File;
import java.net.InetAddress;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;

import org.createyourevent.app.domain.CreateYourEventService;
import org.createyourevent.app.domain.Event;
import org.createyourevent.app.domain.Mp3;
import org.createyourevent.app.domain.Product;
import org.createyourevent.app.domain.Shop;
import org.createyourevent.app.domain.User;
import org.createyourevent.app.repository.CreateYourEventServiceRepository;
import org.createyourevent.app.repository.EventRepository;
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
import org.jaudiotagger.tag.TagException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;

import io.jsonwebtoken.io.IOException;
import io.micrometer.core.annotation.Timed;


@RestController
@RequestMapping("/api")
public class MusicUpload {

    private final Logger log = LoggerFactory.getLogger(MusicUpload.class);

    @Value("${server.port}")
    private String serverPort;

    private ImageService imageService;
    private ProductRepository productRepository;
    private UserRepository userRepository;
    private ShopRepository shopRepository;
    private EventRepository eventRepository;
    private CreateYourEventServiceRepository serviceRepository;
    private Mp3Service mp3Service;

    public MusicUpload(ImageService imageService,
                      ProductRepository productRepository,
                      UserRepository userRepository,
                      ShopRepository shopRepository,
                      EventRepository eventRepository,
                      CreateYourEventServiceRepository serviceRepository,
                      Mp3Service mp3Service) {
        this.imageService = imageService;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.eventRepository = eventRepository;
        this.serviceRepository = serviceRepository;
        this.mp3Service = mp3Service;
    }


    @PostMapping("/music/{serviceId}/{userId}/service")
    @Timed
    public void uploadMP3(@RequestParam("files[]")MultipartFile[] files, @PathVariable Long serviceId, @PathVariable String userId, HttpServletRequest request) throws URISyntaxException {
        Optional<CreateYourEventService> service = this.serviceRepository.findById(serviceId);
        Optional<User> user = this.userRepository.findById(userId);

        Arrays.stream(files).forEach(file -> {

        try {

            Mp3 mp3 = new Mp3();
            mp3.setUser(user.get());
            mp3.setService(service.get());
            mp3Service.save(mp3);

            File tempFile = null;
            tempFile = new File("/app/resources/static/content/music/" + mp3.getId() + ".mp3");
            tempFile.getParentFile().mkdirs();
            Files.copy(file.getInputStream(), tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            AudioFile audioFile = AudioFileIO.read(tempFile);
            AudioHeader ah = audioFile.getAudioHeader();
            audioFile.commit();

            if(!audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && !audioFile.getTag().getFirst(FieldKey.TITLE).equals("")){
                mp3.setArtists(audioFile.getTag().getFirst(FieldKey.ARTIST));
                mp3.setTitle(audioFile.getTag().getFirst(FieldKey.TITLE));
            } else if(!audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && audioFile.getTag().getFirst(FieldKey.TITLE).equals("")) {
                mp3.setArtists(audioFile.getTag().getFirst(FieldKey.ARTIST));
                mp3.setTitle(file.getOriginalFilename());
            } else if(audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && !audioFile.getTag().getFirst(FieldKey.TITLE).equals("")) {
                mp3.setArtists(file.getOriginalFilename());
                mp3.setTitle(audioFile.getTag().getFirst(FieldKey.TITLE));
            } else {
                mp3.setArtists(file.getOriginalFilename());
                mp3.setTitle(file.getOriginalFilename());
            }
            mp3.setDuration(ah.getTrackLength());
            mp3.setUrl("https://" + "createyourevent.org" + "/content/music/" + mp3.getId() + ".mp3");
            mp3Service.partialUpdate(mp3);

        } catch (CannotReadException | java.io.IOException | TagException | ReadOnlyFileException | InvalidAudioFrameException | CannotWriteException e) {
            e.printStackTrace();
        }

        });
    }

    @PostMapping("/music/{shopId}/{userId}/shop")
    @Timed
    public void uploadMP3ForShop(@RequestParam("files[]")MultipartFile[] files, @PathVariable Long shopId, @PathVariable String userId, HttpServletRequest request) throws URISyntaxException {
        Optional<Shop> shop = this.shopRepository.findById(shopId);
        Optional<User> user = this.userRepository.findById(userId);

        Arrays.stream(files).forEach(file -> {

        try {

            Mp3 mp3 = new Mp3();
            mp3.setUser(user.get());
            mp3.setShop(shop.get());
            mp3Service.save(mp3);

            File tempFile = null;
            tempFile = new File("/app/resources/static/content/music/" + mp3.getId() + ".mp3");
            tempFile.getParentFile().mkdirs();
            Files.copy(file.getInputStream(), tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            AudioFile audioFile = AudioFileIO.read(tempFile);
            AudioHeader ah = audioFile.getAudioHeader();
            audioFile.commit();

            if(!audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && !audioFile.getTag().getFirst(FieldKey.TITLE).equals("")){
                mp3.setArtists(audioFile.getTag().getFirst(FieldKey.ARTIST));
                mp3.setTitle(audioFile.getTag().getFirst(FieldKey.TITLE));
            } else if(!audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && audioFile.getTag().getFirst(FieldKey.TITLE).equals("")) {
                mp3.setArtists(audioFile.getTag().getFirst(FieldKey.ARTIST));
                mp3.setTitle(file.getOriginalFilename());
            } else if(audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && !audioFile.getTag().getFirst(FieldKey.TITLE).equals("")) {
                mp3.setArtists(file.getOriginalFilename());
                mp3.setTitle(audioFile.getTag().getFirst(FieldKey.TITLE));
            } else {
                mp3.setArtists(file.getOriginalFilename());
                mp3.setTitle(file.getOriginalFilename());
            }
            mp3.setDuration(ah.getTrackLength());
            mp3.setUrl("https://" + "createyourevent.org" + "/content/music/" + mp3.getId() + ".mp3");
            mp3Service.partialUpdate(mp3);

        } catch (CannotReadException | java.io.IOException | TagException | ReadOnlyFileException | InvalidAudioFrameException | CannotWriteException e) {
            e.printStackTrace();
        }

        });
    }

    @PostMapping("/music/{productId}/{userId}/product")
    @Timed
    public void uploadMP3ForProduct(@RequestParam("files[]")MultipartFile[] files, @PathVariable Long productId, @PathVariable String userId, HttpServletRequest request) throws URISyntaxException {
        Optional<Product> product = this.productRepository.findById(productId);
        Optional<User> user = this.userRepository.findById(userId);

        Arrays.stream(files).forEach(file -> {

        try {

            Mp3 mp3 = new Mp3();
            mp3.setUser(user.get());
            mp3.setProduct(product.get());
            mp3Service.save(mp3);

            File tempFile = null;
            tempFile = new File("/app/resources/static/content/music/" + mp3.getId() + ".mp3");
            tempFile.getParentFile().mkdirs();
            Files.copy(file.getInputStream(), tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            AudioFile audioFile = AudioFileIO.read(tempFile);
            AudioHeader ah = audioFile.getAudioHeader();
            audioFile.commit();

            if(!audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && !audioFile.getTag().getFirst(FieldKey.TITLE).equals("")){
                mp3.setArtists(audioFile.getTag().getFirst(FieldKey.ARTIST));
                mp3.setTitle(audioFile.getTag().getFirst(FieldKey.TITLE));
            } else if(!audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && audioFile.getTag().getFirst(FieldKey.TITLE).equals("")) {
                mp3.setArtists(audioFile.getTag().getFirst(FieldKey.ARTIST));
                mp3.setTitle(file.getOriginalFilename());
            } else if(audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && !audioFile.getTag().getFirst(FieldKey.TITLE).equals("")) {
                mp3.setArtists(file.getOriginalFilename());
                mp3.setTitle(audioFile.getTag().getFirst(FieldKey.TITLE));
            } else {
                mp3.setArtists(file.getOriginalFilename());
                mp3.setTitle(file.getOriginalFilename());
            }
            mp3.setDuration(ah.getTrackLength());
            mp3.setUrl("https://" + "createyourevent.org" + "/content/music/" + mp3.getId() + ".mp3");
            mp3Service.partialUpdate(mp3);

        } catch (CannotReadException | java.io.IOException | TagException | ReadOnlyFileException | InvalidAudioFrameException | CannotWriteException e) {
            e.printStackTrace();
        }

        });
    }


    @PostMapping("/music/{eventId}/{userId}/event")
    @Timed
    public void uploadMP3ForEvent(@RequestParam("files[]")MultipartFile[] files, @PathVariable Long eventId, @PathVariable String userId, HttpServletRequest request) throws URISyntaxException {
        Optional<Event> event = this.eventRepository.findById(eventId);
        Optional<User> user = this.userRepository.findById(userId);

        Arrays.stream(files).forEach(file -> {

        try {

            Mp3 mp3 = new Mp3();
            mp3.setUser(user.get());
            mp3.setEvent(event.get());
            mp3Service.save(mp3);

            File tempFile = null;
            tempFile = new File("/app/resources/static/content/music/" + mp3.getId() + ".mp3");
            tempFile.getParentFile().mkdirs();
            Files.copy(file.getInputStream(), tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            AudioFile audioFile = AudioFileIO.read(tempFile);
            AudioHeader ah = audioFile.getAudioHeader();
            audioFile.commit();

            if(!audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && !audioFile.getTag().getFirst(FieldKey.TITLE).equals("")){
                mp3.setArtists(audioFile.getTag().getFirst(FieldKey.ARTIST));
                mp3.setTitle(audioFile.getTag().getFirst(FieldKey.TITLE));
            } else if(!audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && audioFile.getTag().getFirst(FieldKey.TITLE).equals("")) {
                mp3.setArtists(audioFile.getTag().getFirst(FieldKey.ARTIST));
                mp3.setTitle(file.getOriginalFilename());
            } else if(audioFile.getTag().getFirst(FieldKey.ARTIST).equals("") && !audioFile.getTag().getFirst(FieldKey.TITLE).equals("")) {
                mp3.setArtists(file.getOriginalFilename());
                mp3.setTitle(audioFile.getTag().getFirst(FieldKey.TITLE));
            } else {
                mp3.setArtists(file.getOriginalFilename());
                mp3.setTitle(file.getOriginalFilename());
            }
            mp3.setDuration(ah.getTrackLength());
            mp3.setUrl("https://" + "createyourevent.org" + "/content/music/" + mp3.getId() + ".mp3");
            mp3Service.partialUpdate(mp3);

        } catch (CannotReadException | java.io.IOException | TagException | ReadOnlyFileException | InvalidAudioFrameException | CannotWriteException e) {
            e.printStackTrace();
        }

        });
    }



    @DeleteMapping("/music_del/{id}/delete")
    @Transactional
    public void deleteMp3(@PathVariable Long id) {
        log.debug("REST request to delete Mp3 : {}", id);

        File tempFile = null;
        tempFile = new File("/app/resources/static/content/music/" + id + ".mp3");
        if(tempFile.delete()) {
            mp3Service.delete(id);
            log.debug("Audio file deleted...");
        } else {
            log.debug("Could not delete audio file...");
        }


    }


}
