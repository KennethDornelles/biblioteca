import { Injectable } from '@nestjs/common';
import { CreateSystemConfigurationDto } from './dto/create-system-configuration.dto';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';

@Injectable()
export class SystemConfigurationService {
  create(createSystemConfigurationDto: CreateSystemConfigurationDto) {
    return 'This action adds a new systemConfiguration';
  }

  findAll() {
    return `This action returns all systemConfiguration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemConfiguration`;
  }

  update(id: number, updateSystemConfigurationDto: UpdateSystemConfigurationDto) {
    return `This action updates a #${id} systemConfiguration`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemConfiguration`;
  }
}
