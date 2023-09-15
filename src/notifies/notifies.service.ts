import { Injectable } from '@nestjs/common';
import { Notify, NotifyDocument } from './notifies.schema';
import { Pagination } from 'mongoose-paginate-ts';
import { BaseService } from '../shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { AssetsService } from '../assets/assets.service';
import { UpdateNotifyDto } from './dto/update-notify.dto';
import { MaintenanceType } from 'src/shared/interfaces/maintanance-type';
import moment from 'moment';

@Injectable()
export class NotifiesService extends BaseService<NotifyDocument> {
  constructor(
    @InjectModel(Notify.name)
    private model: Pagination<Notify>,
    private assetService: AssetsService,
  ) {
    super(model);
  }

  async checkAssetExists(id: string): Promise<void> {
    await this.assetService.getById(id);
  }

  fillNextNotify(data: UpdateNotifyDto) {
    switch (data.type) {
      case MaintenanceType.DAILY:
        return { ...data, nextNotify: moment(data.lastNotify).add(1, 'd') };
      case MaintenanceType.WEEKLY:
        return { ...data, nextNotify: moment(data.lastNotify).add(1, 'w') };
      case MaintenanceType.MONTHLY:
        return { ...data, nextNotify: moment(data.lastNotify).add(1, 'M') };
      case MaintenanceType.YEARLY:
        return { ...data, nextNotify: moment(data.lastNotify).add(1, 'y') };

      default:
        return data;
    }
  }
}
