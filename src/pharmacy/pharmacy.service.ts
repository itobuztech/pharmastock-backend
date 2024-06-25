import { Injectable, Logger } from '@nestjs/common';
import { CreatePharmacyInput } from './dto/create-pharmacy.input';
import { PrismaService } from '../prisma/prisma.service';
import { Pharmacy } from '@prisma/client';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Injectable()
export class PharmacyService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(paginationArgs?: PaginationArgs): Promise<Pharmacy[]> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const pharmacy = await this.prisma.pharmacy.findMany({ skip, take });

      return pharmacy;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Pharmacy> {
    const pharmacy = await this.prisma.pharmacy.findFirst({
      where: {
        id,
      },
    });

    if (!pharmacy) {
      throw new Error('No Pharmacy found!');
    }

    return pharmacy;
  }

  async create(createPharmacyInput: CreatePharmacyInput) {
    try {
      const location = JSON.stringify(createPharmacyInput.location);

      let data: any = {
        location,
        name: createPharmacyInput.name || null,
        contact_info: createPharmacyInput.contact_info || null,
      };

      if (createPharmacyInput?.organizationId) {
        data = {
          ...data,
          organization: {
            connect: { id: createPharmacyInput?.organizationId },
          },
        };
      }

      const pharmacy = await this.prisma.pharmacy.create({
        data,
      });

      if (!pharmacy) {
        throw new Error(
          'Could not create the Pharmacy. Please try after sometime!',
        );
      }

      return pharmacy;
    } catch (error) {
      throw error;
    }
  }

  async updatePharmacy(id: string, data) {
    const pharmacy = await this.prisma.pharmacy.update({
      where: {
        id,
      },
      data,
    });

    if (!pharmacy) {
      throw new Error(
        'Could not update the Pharmacy. Please try after sometime!',
      );
    }

    return pharmacy;
  }

  async deletePharmacy(id: string) {
    const deleted = await this.prisma.pharmacy.delete({
      where: {
        id,
      },
    });

    if (!deleted) {
      throw new Error(
        'Could not delete the Pharmacy. Please try after sometime!',
      );
    }
    return deleted;
  }
}
