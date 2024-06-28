import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UsersService } from '../users/users.service';
import { LoginUserInput } from './dto/login-user.input';
import { TokenConfirmationInput } from './dto/token-confirmation.input';
import {
  PrivilegesList,
  PrivilegesListType,
} from '../privileges/user-privileges';

import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async generateToken() {
    // Generate random bytes
    const buffer = randomBytes(32 / 2);
    // Convert to hex string
    return await buffer.toString('hex');
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    const valid = user && (await bcrypt.compare(password, user?.password));

    if (user && valid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async tokenConfirmation(tokenConfirmationInput: TokenConfirmationInput) {
    try {
      const emailConfirmationToken = tokenConfirmationInput.token;
      const user = await this.usersService.findOneByToken(
        emailConfirmationToken,
      );

      return {
        access_token: this.jwtService.sign({
          email: user.email,
          sub: user.id,
          role: user.role,
        }),
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginUserInput: LoginUserInput) {
    const user = await this.usersService.findOne(loginUserInput.email);
    const { password, ...result } = user;

    const match = await bcrypt.compare(loginUserInput.password, password);

    if (!match) throw new UnauthorizedException('Unauthorized');

    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        role: user.role,
      }),
      user: result,
    };
  }

  async signup(signupUserInput: CreateUserInput) {
    try {
      const user = await this.usersService.findOne(signupUserInput.email);

      if (user) {
        throw new Error('User already exists');
      }

      const password = signupUserInput.password;
      const confirmationToken = await this.generateToken();

      const newUser = await this.usersService.create({
        ...signupUserInput,
        password,
        confirmationToken,
      });
      if (!newUser) {
        throw new Error(
          'No User is Created. Please try again after some time!',
        );
      }

      const subject = 'Confirmation Email!';
      const body = `<p>Please confirm your email.</p> 
        <p>By clicking on this link ${process.env.BASE_URL}/token?confirmation_token=${confirmationToken}</p> 
        <p>Thanks</p>
        `;

      const emailSent = await this.emailService.run(
        newUser.email,
        subject,
        body,
      );

      if (!emailSent) {
        throw new Error(
          'No Confirmation email is sent. Please try again after some time!',
        );
      }

      return {
        success: 'The user is created. Please check your email!',
      };
    } catch (error) {
      throw error;
    }
  }

  async getpermissions(ctx: any): Promise<any> {
    const { userId } = ctx.req.user;
    const user = await this.usersService.findOneById(userId);
    return this.rebuildPermissions(
      PrivilegesList,
      user?.role?.privileges as number[],
    );
  }

  rebuildPermissions(
    originalPermissions: PrivilegesListType,
    validCapabilities: number[],
  ): any {
    const rebuiltSections = {};
    for (const sectionkey in originalPermissions) {
      const section = originalPermissions[sectionkey];
      const rebuiltCapabilities = {};
      for (const capabilityKey in section.CAPABILITIES) {
        const capabilityValue = section.CAPABILITIES[capabilityKey];
        rebuiltCapabilities[capabilityKey] = validCapabilities.includes(
          capabilityValue,
        )
          ? capabilityValue
          : null;
      }
      rebuiltSections[sectionkey] = {
        ...section,
        CAPABILITIES: rebuiltCapabilities,
      };
    }
    return rebuiltSections;
  }
}
