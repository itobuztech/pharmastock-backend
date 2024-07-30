import { Injectable, Logger } from '@nestjs/common';
import { CreatePharmacyInput } from './dto/create-pharmacy.input';
import { PrismaService } from '../prisma/prisma.service';
import { Pharmacy } from '@prisma/client';
import { PaginationArgs } from 'src/pagination/pagination.dto';
import { Prisma } from '@prisma/client';
import { PharmacySearchObject } from '../types/extended-types';

@Injectable()
export class PharmacyService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
  ): Promise<{ pharmacies: Pharmacy[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      let whereClause: Prisma.PharmacyWhereInput = { status: true };

      if (searchText) {
        whereClause = {
          OR: [
            { name: { contains: searchText, mode: 'insensitive' } },
            { location: { contains: searchText, mode: 'insensitive' } },
            {
              organization: {
                name: { contains: searchText, mode: 'insensitive' },
              },
            },
          ],
        };
      }

      const totalCount = await this.prisma.pharmacy.count({
        where: whereClause,
      });

      let searchObject: PharmacySearchObject = {
        where: whereClause,
        include: {
          organization: true,
        },
      };
      if (pagination) {
        searchObject = {
          skip,
          take,
          where: whereClause,
          include: {
            organization: true,
          },
        };
      }

      const pharmacies = await this.prisma.pharmacy.findMany(searchObject);

      return { pharmacies, total: totalCount };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Pharmacy> {
    const pharmacy = await this.prisma.pharmacy.findFirst({
      where: {
        id,
      },
      include: {
        organization: true,
      },
    });

    if (!pharmacy) {
      throw new Error('No Pharmacy found!');
    }

    return pharmacy;
  }

  async create(createPharmacyInput: CreatePharmacyInput) {
    try {
      // Handeling Inputs. Starts.
      // Check if the contact info length is not more than 12. Starts.
      if (createPharmacyInput.contactInfo) {
        if (createPharmacyInput.contactInfo.length > 12)
          throw new Error('Contact info should be less than 12 Numbers');
      }
      // Check if the contact info length is not more than 12. Ends.

      //Check if the name of the pharmacy is unique or not. Starts.
      const uniquePharmacy = await this.prisma.pharmacy.findFirst({
        where: {
          status: true,
          name: createPharmacyInput.name,
        },
      });

      if (uniquePharmacy) {
        throw new Error('Pharmacy name alerady present!');
      }
      //Check if the name of the pharmacy is unique or not. Ends.
      // Handeling Inputs. Ends.

      // TO CHECK IF THE ORGANIZATON ID IS PRESENT OR NOT. STARTS.
      const organizationCheck = await this.prisma.organization.findFirst({
        where: {
          id: createPharmacyInput?.organizationId,
        },
      });

      if (!organizationCheck)
        throw new Error('No Organization present with this ID!');
      // TO CHECK IF THE ORGANIZATON ID IS PRESENT OR NOT. ENDS.

      let data: any = {
        location: createPharmacyInput.location || null,
        name: createPharmacyInput.name || null,
        contact_info: createPharmacyInput.contactInfo || null,
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
        include: {
          organization: true,
        },
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
    // Handeling Inputs. Starts.
    // Check if the contact info length is not more than 12. Starts.
    if (data.contactInfo) {
      if (data.contactInfo.length > 12)
        throw new Error('Contact info should be less than 12 Numbers');
    }
    // Check if the contact info length is not more than 12. Ends.

    //Check if the name of the pharmacy is unique or not. Starts.
    if (data.name) {
      const uniquePharmacy = await this.prisma.pharmacy.findFirst({
        where: {
          status: true,
          name: data.name,
          NOT: {
            id,
          },
        },
      });

      if (uniquePharmacy) {
        throw new Error('Pharmacy name alerady present!');
      }
    }
    //Check if the name of the pharmacy is unique or not. Ends.
    // Handeling Inputs. Ends.

    // TO CHECK IF THIS PHARMACY ID IS PRESENT OR NOT. STARTS.
    const pharmacyCheck = await this.prisma.pharmacy.findFirst({
      where: {
        id,
      },
    });

    if (!pharmacyCheck) throw new Error('No Pharmacy present with this ID!');
    // TO CHECK IF THIS PHARMACY ID IS PRESENT OR NOT. ENDS.

    if (data.contactInfo) {
      data.contact_info = data.contactInfo;
      delete data.contactInfo;
    }

    if (data.organizationId) {
      const organizationCheck = await this.prisma.organization.findFirst({
        where: {
          id: data?.organizationId,
        },
      });

      if (!organizationCheck) {
        throw new Error('No Organization present with this ID!');
      }
    }

    const pharmacy = await this.prisma.pharmacy.update({
      where: {
        id,
      },
      data,
      include: { organization: true },
    });

    if (!pharmacy) {
      throw new Error(
        'Could not update the Pharmacy. Please try after sometime!',
      );
    }

    return pharmacy;
  }

  async deletePharmacy(id: string) {
    try {
      const deleted = await this.prisma.pharmacy.update({
        where: {
          id,
        },
        data: { status: false },
      });

      if (!deleted) {
        throw new Error(
          'Could not delete the Pharmacy. Please try after sometime!',
        );
      }

      if (deleted) {
        try {
          await this.prisma.pharmacyStock.updateMany({
            where: {
              pharmacyId: id,
            },
            data: { status: false },
          });
        } catch (error) {
          throw new Error(error);
        }
      }

      return deleted;
    } catch (error) {
      throw new Error(error);
    }
  }
}
