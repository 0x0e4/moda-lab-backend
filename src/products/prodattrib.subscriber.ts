import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { ProductAttributeValue } from 'src/entities/productAttributeValue.entity';
import { ProductVariant } from 'src/entities/productVariant.entity';
import { CategoryAttribute } from 'src/entities/categoryAttribute.entity';

@EventSubscriber()
export class ProductAttributeValueSubscriber
  implements EntitySubscriberInterface<ProductAttributeValue>
{
  listenTo() {
    return ProductAttributeValue;
  }

  async beforeInsert(event: InsertEvent<ProductAttributeValue>) {
    const pav = event.entity;

    if (!pav.variant || !pav.value) return;

    // Загружаем категорию через variant -> product
    const variant = await event.manager.getRepository(ProductVariant).findOne({
      where: { id: pav.variant.id },
      relations: { product: { category: true } },
    });

    if (!variant?.product?.category) return;
    const category = variant.product.category;

    // Проверяем, существует ли CategoryAttribute
    const catAttrRepo = event.manager.getRepository(CategoryAttribute);
    const existing = await catAttrRepo.findOne({
      where: { category: { id: category.id }, attribute: { id: pav.value.attribute.id } },
    });

    if (!existing) {
      const catAttr = catAttrRepo.create({
        category: category,
        attribute: pav.value.attribute,
      });
      await catAttrRepo.save(catAttr);
    }
  }

  async afterRemove(event: RemoveEvent<ProductAttributeValue>) {
    const pav = event.databaseEntity;
    if (!pav.variant || !pav.value) return;

    const variant = await event.manager.getRepository(ProductVariant).findOne({
      where: { id: pav.variant.id },
      relations: { product: { category: true } },
    });

    if (!variant?.product?.category) return;
    const category = variant.product.category;

    const pavCount = await event.manager
      .getRepository(ProductAttributeValue)
      .count({
        where: {
          value: { attribute: { id: pav.value.attribute.id } },
          variant: { product: { category: { id: category.id } } },
        },
        relations: { variant: { product: { category: true } }, value: { attribute: true } },
      });

    if (pavCount === 0) {
      const catAttrRepo = event.manager.getRepository(CategoryAttribute);
      const catAttr = await catAttrRepo.findOne({
        where: { category: { id: category.id }, attribute: { id: pav.value.attribute.id } },
      });
      if (catAttr) {
        await catAttrRepo.remove(catAttr);
      }
    }
  }
}