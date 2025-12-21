import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedCategories1730000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS category (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parentCategoryId INT NULL,
        gender ENUM('unisex', 'male', 'female') NOT NULL,
        CONSTRAINT fk_parent FOREIGN KEY (parentCategoryId) REFERENCES category(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      INSERT INTO category (id, name, parentCategoryId, gender) VALUES
      -- ROOT
      (1, 'Верхняя одежда', NULL, 'unisex'),
      (2, 'Трикотаж', NULL, 'unisex'),
      (3, 'Толстовки и худи', NULL, 'unisex'),
      (4, 'Рубашки и верх', NULL, 'unisex'),
      (5, 'Низ', NULL, 'unisex'),
      (6, 'Спортивная одежда', NULL, 'unisex'),
      (7, 'Домашняя одежда', NULL, 'unisex'),
      (8, 'Аксессуары', NULL, 'unisex'),
      (9, 'Сумки', NULL, 'unisex'),
      (10, 'Женская одежда', NULL, 'female'),
      (11, 'Женское бельё', NULL, 'female'),
      (12, 'Купальники', NULL, 'female'),
      (13, 'Мужское бельё', NULL, 'male'),

      -- ВЕРХНЯЯ ОДЕЖДА (1)
      (101, 'Куртки', 1, 'unisex'),
      (102, 'Пуховики', 1, 'unisex'),
      (103, 'Парки', 1, 'unisex'),
      (104, 'Пальто', 1, 'unisex'),
      (105, 'Тренчи', 1, 'unisex'),
      (106, 'Плащи', 1, 'unisex'),
      (107, 'Бомберы', 1, 'unisex'),

      -- ТРИКОТАЖ (2)
      (201, 'Свитеры', 2, 'unisex'),
      (202, 'Кардиганы', 2, 'unisex'),
      (203, 'Водолазки', 2, 'unisex'),

      -- ХУДИ / ТОЛСТОВКИ (3)
      (301, 'Худи', 3, 'unisex'),
      (302, 'Толстовки', 3, 'unisex'),
      (303, 'Свитшоты', 3, 'unisex'),

      -- РУБАШКИ И ВЕРХ (4)
      (401, 'Рубашки', 4, 'unisex'),
      (402, 'Футболки', 4, 'unisex'),
      (403, 'Лонгсливы', 4, 'unisex'),
      (404, 'Поло', 4, 'unisex'),
      (405, 'Топы', 4, 'unisex'),

      -- НИЗ (5)
      (501, 'Брюки', 5, 'unisex'),
      (502, 'Джоггеры', 5, 'unisex'),
      (503, 'Карго', 5, 'unisex'),
      (504, 'Классические брюки', 5, 'unisex'),
      (505, 'Джинсы', 5, 'unisex'),
      (506, 'Шорты', 5, 'unisex'),

      -- СПОРТ (6)
      (601, 'Спортивные костюмы', 6, 'unisex'),
      (602, 'Спортивные штаны', 6, 'unisex'),
      (603, 'Спортивные футболки', 6, 'unisex'),
      (604, 'Термобельё', 6, 'unisex'),
      (605, 'Защитная экипировка', 6, 'unisex'),

      -- ДОМАШНЯЯ ОДЕЖДА (7)
      (701, 'Пижамы', 7, 'unisex'),
      (702, 'Халаты', 7, 'unisex'),

      -- АКСЕССУАРЫ (8)
      (801, 'Головные уборы', 8, 'unisex'),
      (802, 'Перчатки', 8, 'unisex'),
      (803, 'Шарфы', 8, 'unisex'),
      (804, 'Ремни', 8, 'unisex'),
      (805, 'Очки', 8, 'unisex'),
      (806, 'Зонты', 8, 'unisex'),
      (807, 'Часы', 8, 'unisex'),

      (811, 'Бейсболки', 801, 'unisex'),
      (812, 'Панамы', 801, 'unisex'),
      (813, 'Шапки', 801, 'unisex'),
      (814, 'Балаклавы', 801, 'unisex'),

      -- СУМКИ (9)
      (901, 'Рюкзаки', 9, 'unisex'),
      (902, 'Поясные сумки', 9, 'unisex'),
      (903, 'Мессенджеры', 9, 'unisex'),
      (904, 'Шопперы', 9, 'unisex'),
      (905, 'Кроссбоди', 9, 'unisex'),

      -- ЖЕНСКАЯ ОДЕЖДА (10)
      (1001, 'Платья', 10, 'female'),
      (1002, 'Вечерние платья', 1001, 'female'),
      (1003, 'Коктейльные платья', 1001, 'female'),
      (1004, 'Повседневные платья', 1001, 'female'),
      (1005, 'Сарафаны', 1001, 'female'),

      (1006, 'Юбки', 10, 'female'),
      (1007, 'Юбки мини', 1006, 'female'),
      (1008, 'Юбки миди', 1006, 'female'),
      (1009, 'Юбки макси', 1006, 'female'),

      (1010, 'Блузки', 10, 'female'),

      -- ЖЕНСКОЕ БЕЛЬЁ (11)
      (1101, 'Бюстгальтеры', 11, 'female'),
      (1102, 'Трусы', 11, 'female'),
      (1103, 'Комплекты', 11, 'female'),
      (1104, 'Корректирующее бельё', 11, 'female'),

      -- КУПАЛЬНИКИ (12)
      (1201, 'Раздельные купальники', 12, 'female'),
      (1202, 'Слитные купальники', 12, 'female'),

      -- МУЖСКОЕ БЕЛЬЁ (13)
      (1301, 'Боксёры', 13, 'male'),
      (1302, 'Трусы', 13, 'male'),
      (1303, 'Майки', 13, 'male');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE category`);
  }
}