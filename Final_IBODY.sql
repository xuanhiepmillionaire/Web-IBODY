CREATE TABLE tai_khoan (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL,
    vai_tro VARCHAR(20) CHECK (vai_tro IN ('nguoi_dung', 'chuyen_gia', 'quan_tri')),
    trang_thai VARCHAR(20) CHECK (trang_thai IN ('hoat_dong', 'khoa', 'cho_duyet'))
);

CREATE TABLE nguoi_dung (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tai_khoan_id INT FOREIGN KEY REFERENCES tai_khoan(id),
    ho_ten NVARCHAR(255),
    ngay_sinh DATE,
    gioi_tinh VARCHAR(10) CHECK (gioi_tinh IN ('nam', 'nu', 'khac')),
    muc_tieu_tam_ly NVARCHAR(MAX)
);

CREATE TABLE chuyen_gia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tai_khoan_id INT FOREIGN KEY REFERENCES tai_khoan(id),
    ho_ten NVARCHAR(255),
    so_nam_kinh_nghiem INT,
    so_chung_chi NVARCHAR(100),
    chuyen_mon NVARCHAR(MAX),
    gioi_thieu NVARCHAR(MAX),
    trang_thai VARCHAR(20) CHECK (trang_thai IN ('cho_duyet', 'xac_thuc', 'tu_choi'))
);

CREATE TABLE hoc_van_chuyen_gia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    chuyen_gia_id INT FOREIGN KEY REFERENCES chuyen_gia(id),
    truong NVARCHAR(255),
    bang_cap NVARCHAR(255),
    chuyen_nganh NVARCHAR(255),
    nam_tot_nghiep INT
);

CREATE TABLE thoi_gian_ranh_chuyen_gia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    chuyen_gia_id INT FOREIGN KEY REFERENCES chuyen_gia(id),
    thu_trong_tuan INT CHECK (thu_trong_tuan BETWEEN 0 AND 6),
    tu TIME,
    den TIME
);

CREATE TABLE hinh_thuc_tu_van (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ten VARCHAR(20) CHECK (ten IN ('chat', 'video', 'call')),
    thoi_luong_phut INT,
    gia_co_ban DECIMAL(10,2)
);

CREATE TABLE lich_hen (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nguoi_dung_id INT FOREIGN KEY REFERENCES nguoi_dung(id),
    chuyen_gia_id INT FOREIGN KEY REFERENCES chuyen_gia(id),
    hinh_thuc_id INT FOREIGN KEY REFERENCES hinh_thuc_tu_van(id),
    thoi_gian_bat_dau DATETIME,
    thoi_gian_ket_thuc DATETIME,
    tom_tat NVARCHAR(MAX)
);

CREATE TABLE danh_gia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    lich_hen_id INT FOREIGN KEY REFERENCES lich_hen(id),
    nguoi_dung_id INT FOREIGN KEY REFERENCES nguoi_dung(id),
    chuyen_gia_id INT FOREIGN KEY REFERENCES chuyen_gia(id),
    diem_so INT CHECK (diem_so BETWEEN 1 AND 5),
    nhan_xet NVARCHAR(MAX)
);



CREATE TABLE tin_nhan (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nguoi_gui_id INT FOREIGN KEY REFERENCES tai_khoan(id),
    nguoi_nhan_id INT FOREIGN KEY REFERENCES tai_khoan(id),
    noi_dung NVARCHAR(MAX),
    thoi_gian DATETIME
);

CREATE TABLE thong_bao (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tai_khoan_id INT FOREIGN KEY REFERENCES tai_khoan(id),
    loai VARCHAR(20) CHECK (loai IN ('he_thong', 'lich_hen', 'bao_cao')),
    noi_dung NVARCHAR(MAX),
    da_doc_luc DATETIME
);

CREATE TABLE goi_dich_vu (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ten NVARCHAR(255),
    mo_ta NVARCHAR(MAX),
    gia DECIMAL(10,2),
    thoi_han_ngay INT,
    danh_cho VARCHAR(20) CHECK (danh_cho IN ('nguoi_dung', 'chuyen_gia'))
);

ALTER TABLE goi_dich_vu
ADD so_luot INT NOT NULL DEFAULT 1;

UPDATE goi_dich_vu SET so_luot = 4 WHERE ten LIKE '%Cơ bản%';
UPDATE goi_dich_vu SET so_luot = 8 WHERE ten LIKE '%Nâng cao%';

CREATE TABLE hoa_don (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tai_khoan_id INT FOREIGN KEY REFERENCES tai_khoan(id),
    goi_dich_vu_id INT FOREIGN KEY REFERENCES goi_dich_vu(id),
    tong_tien DECIMAL(10,2),
    thoi_gian_tao DATETIME
);


CREATE TABLE giao_dich (
    id INT IDENTITY(1,1) PRIMARY KEY,
    hoa_don_id INT FOREIGN KEY REFERENCES hoa_don(id),
    phuong_thuc_id INT FOREIGN KEY REFERENCES phuong_thuc_chung(id),
    so_tien DECIMAL(10,2),
    thoi_gian DATETIME
);

ALTER TABLE giao_dich
ADD CONSTRAINT FK_giao_dich_phuong_thuc_chung
FOREIGN KEY (phuong_thuc_id) REFERENCES phuong_thuc_chung(id);

SELECT *
FROM giao_dich
WHERE phuong_thuc_id NOT IN (SELECT id FROM phuong_thuc_chung);


CREATE TABLE bao_cao_vi_pham (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nguoi_bao_cao_id INT FOREIGN KEY REFERENCES tai_khoan(id),
    loai_doi_tuong VARCHAR(20) CHECK (loai_doi_tuong IN ('binh_luan', 'bai_viet', 'nguoi_dung')),
    doi_tuong_id INT,
    ly_do NVARCHAR(MAX),
    thoi_gian DATETIME
);


SELECT name, definition
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID('lich_hen');

ALTER TABLE lich_hen DROP CONSTRAINT CK_lich_hen_trang_thai;
ALTER TABLE lich_hen
ADD CONSTRAINT CK_lich_hen_trang_thai
CHECK (trang_thai IN ('cho_duyet', 'da_dien_ra', 'da_thanh_toan', 'da_huy', 'da_hoan_tat'));

SELECT DISTINCT trang_thai FROM lich_hen;



CREATE TABLE phuong_thuc_chung (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ten NVARCHAR(50) UNIQUE NOT NULL,
    mo_ta NVARCHAR(MAX),
    trang_thai VARCHAR(10) CHECK (trang_thai IN ('hien', 'an')) DEFAULT 'hien'
);


CREATE TABLE goi_dang_ky (
  id INT IDENTITY(1,1) PRIMARY KEY,
  tai_khoan_id INT FOREIGN KEY REFERENCES tai_khoan(id),
  goi_dich_vu_id INT FOREIGN KEY REFERENCES goi_dich_vu(id),
  ngay_bat_dau DATE NOT NULL,
  ngay_ket_thuc DATE NOT NULL,
  so_luot_con_lai INT NOT NULL,
  trang_thai VARCHAR(20) CHECK (trang_thai IN ('con_hieu_luc', 'het_hieu_luc')) DEFAULT 'con_hieu_luc'
);



INSERT INTO AspNetRoles (Id, Name, NormalizedName)
VALUES (NEWID(), 'chuyen_gia', 'CHUYEN_GIA');



ALTER TABLE lich_hen ADD trang_thai VARCHAR(20) 
    CHECK (trang_thai IN ('cho_thanh_toan', 'da_thanh_toan', 'da_huy'))
    DEFAULT 'cho_thanh_toan';


ALTER TABLE lich_hen DROP CONSTRAINT CK__lich_hen__trang_thai;
ALTER TABLE lich_hen
ADD CONSTRAINT CK_lich_hen_trang_thai
CHECK (trang_thai IN ('cho_duyet', 'cho_thanh_toan', 'da_thanh_toan', 'da_huy', 'da_dien_ra'));


ALTER TABLE lich_hen DROP CONSTRAINT CK__lich_hen__trang__25518C17;

SELECT name
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID('lich_hen');

ALTER TABLE lich_hen DROP CONSTRAINT CK_lich_hen_trang_thai;



ALTER TABLE lich_hen
ADD CONSTRAINT CK_lich_hen_trang_thai
CHECK (trang_thai IN ('cho_duyet', 'cho_thanh_toan', 'da_thanh_toan', 'da_huy', 'da_dien_ra'));


ALTER TABLE nguoi_dung ADD avatar_url NVARCHAR(255);
ALTER TABLE chuyen_gia ADD avatar_url NVARCHAR(255);


ALTER TABLE tai_khoan ADD reset_token NVARCHAR(255),reset_token_expiry DATETIME;

CREATE TABLE YeuCauNhanLuong (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ChuyenGiaId INT NOT NULL,
    SoCa INT NOT NULL,
    SoTien DECIMAL(18,2) NOT NULL,
    NgayTao DATETIME DEFAULT GETDATE(),
    TrangThai NVARCHAR(20) DEFAULT 'dang_cho', -- dang_cho / da_duyet / tu_choi
    FOREIGN KEY (ChuyenGiaId) REFERENCES chuyen_gia(id)
);
ALTER TABLE chuyen_gia
ADD so_tai_khoan NVARCHAR(50),
    ten_ngan_hang NVARCHAR(255);


CREATE TABLE YeuCauXacNhanGoiDichVu (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TaiKhoanId INT NOT NULL,
    GoiDichVuId INT NOT NULL,
    NoiDungChuyenKhoan NVARCHAR(255), -- ví dụ: "user_12_goi_3"
    TrangThai NVARCHAR(20) DEFAULT 'cho_duyet', -- 'cho_duyet' | 'da_duyet' | 'tu_choi'
    NgayTao DATETIME DEFAULT GETDATE()
);


ALTER TABLE lich_hen
ADD NgayTao DATETIME DEFAULT GETDATE();


use Final_IBODY









EXEC sp_help 'giao_dich';


SELECT *
FROM lich_hen
WHERE id = 1;

use Final_IBODY


SELECT * FROM tai_khoan WHERE email = 'admin@123.com'




SELECT COUNT(*) FROM lich_hen 
WHERE chuyen_gia_id = 7  AND trang_thai = 'da_hoan_tat'



-- 1. Tài khoản
INSERT INTO tai_khoan (email, mat_khau, vai_tro, trang_thai) VALUES
('alice@example.com', 'hashed_pw1', 'nguoi_dung', 'hoat_dong'),
('bob@example.com', 'hashed_pw2', 'chuyen_gia', 'hoat_dong'),
('admin@example.com', 'hashed_pw3', 'quan_tri', 'hoat_dong');



-- 2. Người dùng
INSERT INTO nguoi_dung (tai_khoan_id, ho_ten, ngay_sinh, gioi_tinh, muc_tieu_tam_ly) VALUES
(1, N'Alice Nguyễn', '1995-08-15', 'nu', N'Cải thiện giấc ngủ, giảm lo âu');

-- 3. Chuyên gia
INSERT INTO chuyen_gia (tai_khoan_id, ho_ten, so_nam_kinh_nghiem, so_chung_chi, chuyen_mon, gioi_thieu, trang_thai) VALUES
(2, N'Dr. Bob Lê', 7, 'CHG123456', N'Trị liệu nhận thức hành vi', N'Chuyên trị liệu stress, mất ngủ cho người trẻ', 'xac_thuc');

-- 4. Học vấn
INSERT INTO hoc_van_chuyen_gia (chuyen_gia_id, truong, bang_cap, chuyen_nganh, nam_tot_nghiep) VALUES
(1, N'ĐH Y Hà Nội', N'Thạc sĩ Tâm lý', N'Tham vấn học đường', 2018);

-- 5. Hình thức tư vấn
INSERT INTO hinh_thuc_tu_van (ten, thoi_luong_phut, gia_co_ban) VALUES
('chat', 30, 150000),
('video', 45, 250000);

-- 6. Lịch hẹn
INSERT INTO lich_hen (nguoi_dung_id, chuyen_gia_id, hinh_thuc_id, thoi_gian_bat_dau, thoi_gian_ket_thuc, tom_tat) VALUES
(1, 1, 2, '2025-04-20 09:00:00', '2025-04-20 09:45:00', N'Tư vấn giấc ngủ và lo âu');

-- 7. Gói dịch vụ
INSERT INTO goi_dich_vu (ten, mo_ta, gia, thoi_han_ngay, danh_cho) VALUES
(N'Gói cơ bản 1 tháng', N'Tư vấn 4 buổi video call / tháng', 900000, 30, 'nguoi_dung');

-- 8. Hóa đơn
INSERT INTO hoa_don (tai_khoan_id, goi_dich_vu_id, tong_tien, thoi_gian_tao) VALUES
(1, 1, 900000, GETDATE());

-- 9. Phương thức thanh toán
INSERT INTO phuong_thuc_thanh_toan (tai_khoan_id, loai, chi_tiet) VALUES
(1, 'the_tin_dung', '{"last4":"1234"}');

-- 10. Giao dịch
INSERT INTO giao_dich (hoa_don_id, phuong_thuc_id, so_tien, thoi_gian) VALUES
(1, 1, 900000, GETDATE());

-- 11. Đánh giá
INSERT INTO danh_gia (lich_hen_id, nguoi_dung_id, chuyen_gia_id, diem_so, nhan_xet) VALUES
(1, 1, 1, 5, N'Rất hài lòng, chuyên gia nhiệt tình và lắng nghe!');