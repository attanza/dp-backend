import { ResourcePaginationPipe } from 'src/shared/pipes/resource-pagination.pipe';
import moment from 'moment';
export const queryStringParser = (
  ctx: ResourcePaginationPipe,
  searchable: string[],
  moreQueries = {},
) => {
  let query = {};

  if (ctx.fieldKey && ctx.fieldValue) {
    if (
      Array.isArray(ctx.fieldKey) &&
      Array.isArray(ctx.fieldValue) &&
      ctx.fieldKey.length === ctx.fieldValue.length
    ) {
      for (let i = 0; i < ctx.fieldKey.length; i++) {
        const addedQuery = {};
        addedQuery[ctx.fieldKey[i]] = ctx.fieldValue[i];
        query = { ...query, ...addedQuery };
      }
    } else {
      query[ctx.fieldKey] = ctx.fieldValue;
    }
  }

  if (ctx.fieldInKey && ctx.fieldInValue) {
    const { fieldInKey, fieldInValue } = ctx;
    query = { ...query, [fieldInKey]: { $in: fieldInValue.split(',') } };
  }

  if (ctx.regexKey && ctx.regexValue) {
    if (
      Array.isArray(ctx.regexKey) &&
      Array.isArray(ctx.regexValue) &&
      ctx.regexKey.length === ctx.regexValue.length
    ) {
      const or = [];
      for (let i = 0; i < ctx.regexKey.length; i++) {
        const addedQuery = {};
        addedQuery[ctx.regexKey[i]] = {
          $regex: ctx.regexValue[i],
          $options: 'i',
        };
        or.push(addedQuery);
      }
      query['$or'] = or;
    } else {
      query[ctx.regexKey] = {
        $regex: ctx.regexValue,
        $options: 'i',
      };
    }
  }

  if (ctx.dateRangeField && ctx.startDateRange && ctx.endDateRange) {
    const startDate = moment(ctx.startDateRange).startOf('day').toDate();
    const endDate = moment(ctx.endDateRange).endOf('day').toDate();
    query[ctx.dateRangeField] = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  if (ctx.search && searchable) {
    if (searchable.length > 0) {
      const or = [];

      searchable.map((key) => {
        const addedQuery = {};
        addedQuery[key] = {
          $regex: ctx.search,
          $options: 'i',
        };
        or.push(addedQuery);
      });
      query['$or'] = or;
    }
  }

  const sort = {};
  if (ctx.sortBy) {
    sort[ctx.sortBy] = ctx.sortMode || 1;
  }

  // if (ctx.relations) {
  //   ctx.query.populate = ctx.relations;
  // }

  query = { ...query, ...moreQueries };

  const options = {
    query,
    select: ctx.select,
    sort,
    populate: ctx.populate,
    limit: Number(ctx.limit) || 10,
    page: Number(ctx.page) || 1,
    lean: true,
  };

  // const redisKey = crypto.createHash('md5').update(JSON.stringify(options)).digest('hex');
  // return { options, redisKey };
  return options;
};
