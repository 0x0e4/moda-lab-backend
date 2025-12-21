import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedProducts1734000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // -------------------------
    // 1. Добавление 100 товаров (без price и gender, только id, name, description, categoryId)
    // -------------------------
    await queryRunner.query(`
      INSERT INTO product (id, name, description, categoryId) VALUES
      ${Array.from({ length: 100 }, (_, i) => {
        const id = i + 1;
        const categoryId = 101 + (i % 30) * 10; // простое распределение по категориям
        return `(${id}, 'Товар ${id}', 'Описание товара ${id}', ${categoryId})`;
      }).join(",\n")}
    `);

    // -------------------------
    // 2. Добавление вариантов (1–3 варианта на товар)
    // -------------------------
    let variantsSQL = '';
    let variantId = 1;
    for (let i = 1; i <= 100; i++) {
      const variantCount = Math.floor(Math.random() * 3) + 1; // 1–3 варианта
      for (let v = 0; v < variantCount; v++) {
        const price = 1000 + i * 50 + v * 100;
        const stock = 5 + v * 5;
        variantsSQL += `(${variantId}, ${i}, 'SKU-${i}-${v+1}', ${price}, ${stock}),\n`;
        variantId++;
      }
    }
    variantsSQL = variantsSQL.slice(0, -2); // убрать последнюю запятую и перевод строки
    await queryRunner.query(`
      INSERT INTO product_variant (id, productId, sku, price, stock) VALUES
      ${variantsSQL}
    `);

    // -------------------------
    // 3. Добавление атрибутов
    // -------------------------
    const colors = ['Синий', 'Красный', 'Зелёный', 'Чёрный', 'Белый', 'Серый', 'Бежевый'];
    const sizes = ['S','M','L','XL'];
    const materials = ['Хлопок','Полиэстер','Шерсть','Кашемир','Шелк','Джинса'];
    let attributesSQL = '';
    for (let i = 1; i <= 100; i++) {
      const color = colors[i % colors.length];
      const size = sizes[i % sizes.length];
      const material = materials[i % materials.length];
      attributesSQL += `(${i}, 1, '${color}'),\n`; // цвет
      attributesSQL += `(${i}, 2, '${size}'),\n`;  // размер
      attributesSQL += `(${i}, 3, '${material}'),\n`; // материал
    }
    attributesSQL = attributesSQL.slice(0, -2);
    await queryRunner.query(`
      INSERT INTO product_attribute_value (productId, attributeId, value) VALUES
      ${attributesSQL}
    `);

    // -------------------------
    // 4. Добавление картинок (1–3 картинки на товар)
    // -------------------------
    let imagesSQL = '';
    for (let i = 1; i <= 100; i++) {
      const imgCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < imgCount; j++) {
        const main = j === 0 ? 'true' : 'false';
        imagesSQL += `(${i}, 'https://picsum.photos/seed/${i}-${j}/400/400', ${main}),\n`;
      }
    }
    imagesSQL = imagesSQL.slice(0, -2);
    await queryRunner.query(`
      INSERT INTO product_image (productId, url, isMain) VALUES
      ${imagesSQL}
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM product_image`);
    await queryRunner.query(`DELETE FROM product_attribute_value`);
    await queryRunner.query(`DELETE FROM product_variant`);
    await queryRunner.query(`DELETE FROM product`);
  }
}
