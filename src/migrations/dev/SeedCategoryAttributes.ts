import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedCategoryAttributes1732000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Функция для вставки с обновлением
    async function insertCategoryAttributes(catIds: number[], attributeIds: number[]) {
      for (const catId of catIds) {
        const values = attributeIds
          .map(
            (attrId) =>
              `(${catId}, ${attrId}, true)`
          )
          .join(", ");
        await queryRunner.query(`
          INSERT INTO category_attribute (categoryId, attributeId, isFilterable)
          VALUES ${values}
          ON DUPLICATE KEY UPDATE isFilterable = VALUES(isFilterable);
        `);
      }
    }

    // Верхняя одежда (id = 1, 101–107)
    await insertCategoryAttributes([1, 101, 102, 103, 104, 105, 106, 107], [1, 2, 3, 4, 12, 11]);

    // Трикотаж (id = 2, 201–203)
    await insertCategoryAttributes([2, 201, 202, 203], [1, 2, 3, 17, 16]);

    // Худи и толстовки (id = 3, 301–303)
    await insertCategoryAttributes([3, 301, 302, 303], [1, 2, 3, 12, 6, 16]);

    // Рубашки и верх (id = 4, 401–405)
    await insertCategoryAttributes([4, 401, 402, 403, 404, 405], [1, 2, 3, 5, 6, 7]);

    // Низ (id = 5, 501–506)
    await insertCategoryAttributes([5, 501, 502, 503, 504, 505, 506], [1, 2, 3, 16]);

    // Спортивная одежда (id = 6, 601–605)
    await insertCategoryAttributes([6, 601, 602, 603, 604, 605], [1, 2, 3, 10, 17]);

    // Домашняя одежда (id = 7, 701, 702)
    await insertCategoryAttributes([7, 701, 702], [1, 2, 3, 16]);

    // Аксессуары (id = 8, 801–807)
    await insertCategoryAttributes([8, 801, 802, 803, 804, 805, 806, 807], [1, 20]);

    // Сумки (id = 9, 901–905)
    await insertCategoryAttributes([9, 901, 902, 903, 904, 905], [1, 13]);

    // Женская одежда (id = 10, 1001–1010)
    await insertCategoryAttributes([10, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010], [1, 2, 3, 14, 16]);

    // Женское бельё (11, 1101–1104)
    await insertCategoryAttributes([11, 1101, 1102, 1103, 1104], [1, 2, 3, 16]);

    // Купальники (12, 1201, 1202)
    await insertCategoryAttributes([12, 1201, 1202], [1, 2, 3]);

    // Мужское бельё (13, 1301, 1302, 1303)
    await insertCategoryAttributes([13, 1301, 1302, 1303], [1, 2, 3]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM category_attribute`);
  }
}
