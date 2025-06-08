CREATE TABLE MAIN_LABEL (
    id SERIAL PRIMARY KEY,
    label_name VARCHAR(50) NOT NULL,
    UNIQUE(label_name)
);

CREATE TABLE SECONDARY_LABEL (
    mlabel_id INT,
    slabel_id INT,
    label_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (mlabel_id, slabel_id),
    FOREIGN KEY (mlabel_id) REFERENCES MAIN_LABEL(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE RESTAURANT (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    mlabel_id INT NOT NULL,
    slabel_id INT NOT NULL,
    latitude DECIMAL(12, 8) NOT NULL,
    longitude DECIMAL(12, 8) NOT NULL,
    eat_in BOOLEAN NOT NULL,
    FOREIGN KEY (mlabel_id, slabel_id) REFERENCES SECONDARY_LABEL(mlabel_id, slabel_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
)