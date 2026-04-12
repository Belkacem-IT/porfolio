classDiagram
    class PATIENT {
        <<Table PostgreSQL>>
        +UUID patient_id [PK]
        +VARCHAR(18) nin [UNIQUE]
        +VARCHAR(12) nss [Indexé]
        +VARCHAR(20) ipp [Indexé]
        +VARCHAR(100) nom_latin [NOT NULL]
        +VARCHAR(100) prenom_latin [NOT NULL]
        +VARCHAR(100) nom_arabe [Optionnel]
        +VARCHAR(100) prenom_arabe [Optionnel]
        +DATE date_naissance [NOT NULL]
        +CHAR(1) sexe [NOT NULL]
        +INT code_wilaya [NOT NULL]
        +VARCHAR(3) groupage [Optionnel]
    }