import { CategoryAttrib } from 'src/entities/catattrib.entity';
import { ProductAttrib } from 'src/entities/prodattrib.entity';
import { Product } from 'src/entities/product.entity';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  DataSource,
  RemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class ProductAttribSubscriber implements EntitySubscriberInterface<ProductAttrib> {

  listenTo() {
    return ProductAttrib;
  }

  async beforeInsert(event: InsertEvent<ProductAttrib>) {
    const entity = event.entity;
    const prod = await event.manager.getRepository(Product).findOne({ where: { id: event.entity.prodId }, relations: { category: true }});
    if(prod == null) return;

    entity.category = prod.category;
    const catAttribRep = event.manager.getRepository(CategoryAttrib);

    if((await catAttribRep.findBy({ category: entity.category, attribName: entity.attribName })).length == 0)
    {
      const catAttrib = catAttribRep.create({ category: entity.category, attribName: entity.attribName });
      await catAttribRep.save(catAttrib);
    }
  }

  async afterRemove(event: RemoveEvent<ProductAttrib>) {
    const entity = event.databaseEntity;
    const catAttribRep = event.manager.getRepository(CategoryAttrib);
    const prodAttribRep = event.manager.getRepository(ProductAttrib);

    if(await prodAttribRep.count({ where: { category: entity.category, attribName: entity.attribName } }) == 0)
    {
      const catAttrib = await catAttribRep.findOneBy({ category: entity.category, attribName: entity.attribName });
      if(catAttrib !== null)
        catAttribRep.remove(catAttrib);
    }
  }
}