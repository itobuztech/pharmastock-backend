import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { resetDatabase, seedData } from './prisma/seed'; // Adjust import as per your file structure

@Injectable()
export class SchedulerService {
  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  async handleDailyReset() {
    console.log('Starting daily reset...');
    try {
      await resetDatabase();
      await seedData();
      console.log('Database reset and seeded successfully.');
    } catch (error) {
      console.error('Error during daily reset:', error);
    }
  }
}
