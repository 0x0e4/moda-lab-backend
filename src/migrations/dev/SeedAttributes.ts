import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedProducts1731000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Вставляем категории (пример)
    await queryRunner.query(`
      INSERT INTO category (id, name, parentCategoryId, gender) VALUES
      (1, 'Мужская одежда', NULL, 'male'),
      (2, 'Женская одежда', NULL, 'female'),
      (3, 'Унисекс', NULL, 'unisex')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);

    // Связь категории с атрибутами (пример)
    // Здесь можно вставить конкретные связи для каждой категории
    await queryRunner.query(`
      INSERT INTO category_attribute (categoryId, attributeId, isFilterable) VALUES
      (1, 1, 1), -- Мужская одежда - Цвет
      (1, 2, 1), -- Мужская одежда - Размер
      (1, 3, 0), -- Мужская одежда - Материал
      (2, 1, 1),
      (2, 2, 1),
      (2, 3, 0),
      (3, 1, 1),
      (3, 2, 1)
      ON DUPLICATE KEY UPDATE isFilterable=VALUES(isFilterable);
    `);

    for (let i = 1; i <= 100; i++) {
      // Выбираем категорию по модулю для разнообразия
      const categoryId = (i % 3) + 1;

      // Вставляем товар
      await queryRunner.query(`
        INSERT INTO product (name, description, categoryId)
        VALUES ('Товар ${i}', 'Описание товара ${i}', ${categoryId});
      `);

      // Получаем id последнего вставленного товара
      const [{ insertId }] = await queryRunner.query(`SELECT LAST_INSERT_ID() AS insertId`);
      const productId = insertId;

      // Вставляем два варианта товара (SKU, цена, сток)
      for (let v = 1; v <= 2; v++) {
        const sku = `SKU${productId}-${v}`;
        const price = (1000 + i * 10 + v * 5).toFixed(2);
        const stock = 50 + i - v;

        await queryRunner.query(`
          INSERT INTO product_variant (productId, sku, price, stock)
          VALUES (${productId}, '${sku}', ${price}, ${stock});
        `);

        const [{ insertId: variantId }] = await queryRunner.query(`SELECT LAST_INSERT_ID() AS insertId`);

        // Привязываем атрибуты к варианту товара (цвет и размер)
        // Пример значений: цвет из attribute_value с id 100+ (Цвет), размер из 110+ (Размер)
        const colorValueId = 100 + ((i + v) % 10); // Цвета 100-109
        const sizeValueId = 110 + ((i + v) % 6);   // Размеры 110-115

        await queryRunner.query(`
          INSERT INTO product_attribute_value (variantId, valueId)
          VALUES
            (${variantId}, ${colorValueId}),
            (${variantId}, ${sizeValueId});
        `);

        // Добавляем изображение для варианта
        const imageUrl = `https://example.com/images/product_${productId}_variant_${variantId}.jpg`;

        await queryRunner.query(`
          INSERT INTO product_image (url, sortOrder, variantId)
          VALUES ('${imageUrl}', 1, ${variantId});
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем продукты и связанные данные
    await queryRunner.query(`DELETE FROM product_image WHERE variantId IN (SELECT id FROM product_variant)`);
    await queryRunner.query(`DELETE FROM product_attribute_value WHERE variantId IN (SELECT id FROM product_variant)`);
    await queryRunner.query(`DELETE FROM product_variant WHERE productId IN (SELECT id FROM product)`);
    await queryRunner.query(`DELETE FROM product WHERE id <= 100`);

    // Можно очистить категории и category_attribute, если нужно
    await queryRunner.query(`DELETE FROM category_attribute WHERE categoryId IN (1,2,3)`);
    await queryRunner.query(`DELETE FROM category WHERE id IN (1,2,3)`);
  }
}
