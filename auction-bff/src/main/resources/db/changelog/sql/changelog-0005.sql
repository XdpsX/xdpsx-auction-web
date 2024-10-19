# password: 12345678
INSERT INTO users (name, email, password, provider, enabled, verified)
    VALUE (
           "Admin A",
           "admina@xdpsx.com",
           "$2a$12$Mb8xVouKAkVZi40f.ZQCM.upOCEnYCDYjtgNhEZ1QxrYvyDN9.Ula",
           "SYSTEM",
           TRUE,
           TRUE
          );

INSERT INTO users_roles(user_id, role_id)
    VALUE (1,1);
