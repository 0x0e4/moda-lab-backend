import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedProducts1733000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Вспомогательная функция для вставки с возможным обновлением (если поддерживается)
    async function insertOrUpdate(table: string, columns: string[], valuesArray: any[][]) {
      if (valuesArray.length === 0) return;
      const valuesStr = valuesArray
        .map(
          (values) =>
            "(" +
            values
              .map((v) =>
                typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : v
              )
              .join(", ") +
            ")"
        )
        .join(", ");
      // Пример для MySQL с ON DUPLICATE KEY UPDATE isMain = VALUES(isMain)
      // Для простоты здесь просто используем INSERT IGNORE, чтобы не дублировать
      // Можно заменить на ON DUPLICATE KEY UPDATE в зависимости от БД и индексов
      await queryRunner.query(
        `INSERT IGNORE INTO ${table} (${columns.join(", ")}) VALUES ${valuesStr}`
      );
    }

    // -------------------------
    // 1. Создание товаров (product)
    // -------------------------
    await insertOrUpdate(
      "product",
      ["id", "name", "categoryId", "description", "price", "gender"],
      [
        [1, "Куртка зимняя мужская", 101, "Тёплая зимняя куртка с капюшоном", 12000, "male"],
        [2, "Худи унисекс серый", 301, "Удобное худи из хлопка", 3500, "unisex"],
        [3, "Свитер кашемировый женский", 201, "Элегантный женский свитер", 8000, "female"],
        [4, "Джинсы мужские прямые", 505, "Классические джинсы синего цвета", 5000, "male"],
        [5, "Платье вечернее красное", 1002, "Шикарное вечернее платье", 15000, "female"],
        [6, "Спортивный костюм мужской", 601, "Комфортный спортивный костюм", 7000, "male"],
        [7, "Рюкзак городской", 901, "Практичный городской рюкзак", 4500, "unisex"],
        [8, "Шапка зимняя", 813, "Тёплая шапка из шерсти", 1200, "unisex"],
        [9, "Боксёры мужские хлопок", 1301, "Удобные хлопковые боксёры", 800, "male"],
        [10, "Пижама женская", 701, "Ночная пижама из мягкого хлопка", 3000, "female"],
      ]
    );

    // -------------------------
    // 2. Создание вариантов (product_variant)
    // -------------------------
    await insertOrUpdate(
      "product_variant",
      ["id", "productId", "sku", "price", "stock"],
      [
        [1, 1, "JK-101-M", 12000, 10],
        [2, 1, "JK-101-L", 12000, 8],
        [3, 2, "HD-301-S", 3500, 15],
        [4, 2, "HD-301-M", 3500, 12],
        [5, 3, "SV-201-S", 8000, 5],
        [6, 3, "SV-201-M", 8000, 7],
        [7, 4, "JN-505-32", 5000, 20],
        [8, 4, "JN-505-34", 5000, 15],
        [9, 5, "DR-1002-36", 15000, 3],
        [10, 5, "DR-1002-38", 15000, 2],
      ]
    );

    // -------------------------
    // 3. Привязка атрибутов к товарам (product_attribute_value)
    // -------------------------
    await insertOrUpdate(
      "product_attribute_value",
      ["productId", "attributeId", "value"],
      [
        // Куртка зимняя мужская
        [1, 1, "Синий"],
        [1, 2, "M"],
        [1, 3, "Пух"],
        [1, 4, "Длинный"],
        [1, 12, "Да"],

        // Худи унисекс серый
        [2, 1, "Серый"],
        [2, 2, "M"],
        [2, 3, "Хлопок"],
        [2, 12, "Да"],

        // Свитер женский
        [3, 1, "Бежевый"],
        [3, 2, "S"],
        [3, 3, "Кашемир"],

        // Джинсы мужские
        [4, 1, "Синий"],
        [4, 2, "34"],
        [4, 3, "Джинса"],

        // Платье вечернее
        [5, 1, "Красный"],
        [5, 2, "36"],
        [5, 3, "Шелк"],

        // Спортивный костюм
        [6, 1, "Чёрный"],
        [6, 2, "L"],
        [6, 3, "Полиэстер"],

        // Рюкзак городской
        [7, 1, "Чёрный"],
        [7, 13, "5"],

        // Шапка зимняя
        [8, 1, "Серый"],

        // Боксёры мужские
        [9, 1, "Белый"],
        [9, 2, "L"],
        [9, 3, "Хлопок"],

        // Пижама женская
        [10, 1, "Розовый"],
        [10, 2, "M"],
        [10, 3, "Хлопок"],
      ]
    );

    // -------------------------
    // 4. Добавление картинок (product_image)
    // -------------------------
    await insertOrUpdate(
      "product_image",
      ["productId", "url", "isMain"],
      [
        [1, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0a", true],
        [1, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0b", false],
        [2, "https://images.unsplash.com/photo-1593032465170-2d6d2c4b0f1a", true],
        [3, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0c", true],
        [4, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0d", true],
        [5, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0e", true],
        [6, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0f", true],
        [7, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0g", true],
        [8, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0h", true],
        [9, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0i", true],
        [10, "https://images.unsplash.com/photo-1602810318696-0f334b8b5e0j", true],
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем в обратном порядке из зависимых таблиц
    await queryRunner.query(`DELETE FROM product_image`);
    await queryRunner.query(`DELETE FROM product_attribute_value`);
    await queryRunner.query(`DELETE FROM product_variant`);
    await queryRunner.query(`DELETE FROM product`);
  }
}
