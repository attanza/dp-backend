import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { Pagination } from 'mongoose-paginate-ts';
import { queryStringParser } from 'src/utils/parseQueryString';
import { ResourcePaginationPipe } from '../pipes/resource-pagination.pipe';

@Injectable()
export abstract class BaseService<T> {
  private readonly dbModel: Pagination<any>;

  constructor(model: Pagination<any>) {
    this.dbModel = model;
  }

  /**
   * Retrieval
   */

  async find(filter: FilterQuery<T> = {}) {
    return this.dbModel.find<T>(filter);
  }

  async paginate(query: ResourcePaginationPipe, searchable: string[] = []) {
    const options = queryStringParser(query, searchable);

    return this.dbModel.paginate(options);
  }

  async findOne<T>(
    filter?: FilterQuery<any>,
    projection?: ProjectionType<any>,
    options?: QueryOptions<any>,
    populate: any = '',
  ): Promise<T> {
    return this.dbModel
      .findOne(filter, projection, options)
      .populate(populate)
      .exec();
  }

  async findById<T>(
    id: any,
    projection?: ProjectionType<any>,
    options?: QueryOptions<any>,
  ): Promise<T> {
    return this.dbModel.findById(id, projection, options).exec();
  }

  async findOrFail<T>(
    filter?: FilterQuery<any>,
    projection?: ProjectionType<any>,
    options?: QueryOptions<any>,
    populate: any = '',
  ): Promise<T> {
    const found = await this.findOne<T>(filter, projection, options, populate);
    if (!found) {
      throw new BadRequestException(`${this.dbModel.modelName} not found`);
    }
    return found;
  }

  async findBy<T>(filter?: FilterQuery<any>): Promise<T> {
    const found = await this.findOne<T>(filter);
    return found;
  }

  /**
   * Write
   */

  async create(createDto: any, uniques: string[] = []): Promise<T> {
    await this.shouldUnique(createDto, uniques);
    const created = await this.dbModel.create(createDto);
    return created;
  }

  async insertMany(data: any[]) {
    await this.dbModel.insertMany(data);
  }

  async update(data: any, updateDto: any, uniques: string[] = []): Promise<T> {
    if (Object.keys(updateDto).length > 0) {
      await this.shouldUnique(updateDto, uniques, data._id);
      Object.keys(updateDto).map((key) => {
        if (updateDto.hasOwnProperty(key)) {
          data[key] = updateDto[key];
        }
      });
      await data.save();
    }
    return data;
  }

  async delete(data: any): Promise<void> {
    await this.dbModel.deleteOne({ _id: data._id });
  }

  /**
   * Find resource by id, when it not found then throw error
   * @param id: string
   * @returns Promise<resource>
   */
  async getById(id: string) {
    const found = await this.dbModel.findById(id).exec();
    if (!found) {
      throw new BadRequestException(`${this.dbModel.modelName} not found`);
    }
    return found;
  }

  /**
   * Utils
   */

  async shouldExists(ids: string[]) {
    const found = await this.dbModel.find({ _id: { $in: ids } });
    if (found.length !== ids.length) {
      throw new UnprocessableEntityException(
        `${this.dbModel.modelName} not exists`,
      );
    }
  }

  async shouldUnique(
    dto: any,
    uniques: string[],
    id?: string,
  ): Promise<boolean> {
    if (uniques.length > 0) {
      const or = [];
      uniques.map((key) => {
        if (dto[key]) {
          or.push({ [key]: dto[key] });
        }
      });
      if (or.length > 0) {
        const found = await this.dbModel
          .findOne({ $or: or })
          .select('_id')
          .exec();

        if (found && id && found._id.toString() === id.toString()) {
          return true;
        } else if (found) {
          throw new BadRequestException(
            `${uniques.join('|')} should be unique`,
          );
        } else {
          return true;
        }
      }
    }
  }
}
