package com.xdpsx.auction.model;

import com.xdpsx.auction.constant.FileConstants;
import com.xdpsx.auction.model.enums.AuthProvider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "medias")
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String filePath;

    private String mediaType;

    public String getUrl(){
        if (mediaType.equals(FileConstants.EXTERNAL_FILE_TYPE)){
            return filePath;
        }
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(String.format("/medias/%1$s/file/%2$s", id, fileName))
                .build().toUriString();
    }

}
