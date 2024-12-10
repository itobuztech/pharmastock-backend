import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { generateInvitePassword, generateToken } from '../util/helper';
import {
  ForgotPasswordConfirmationInput,
  ForgotPasswordInput,
} from './dto/forgot-password';
import {
  ForgotPasswordResponse,
  ValidateForgotPasswordResponse,
} from './dto/forgot-password-response';
import { AccountService } from 'src/account/account.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly accountService: AccountService,
  ) {}

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

    if (!match) throw new NotFoundException('Invalid credentials!');

    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        role: user.role,
      }),
      user: result,
    };
  }

  async signup(signUpStaffInput) {
    try {
      const user = await this.usersService.findOne(signUpStaffInput.email);

      if (user) {
        throw new Error('User already exists');
      }

      const password = signUpStaffInput.password;
      const confirmationToken = await generateToken();

      signUpStaffInput.role = 'STAFF';
      const newUser = await this.usersService.create({
        ...signUpStaffInput,
        password,
        confirmationToken,
      });
      if (!newUser) {
        throw new Error(
          'No User is Created. Please try again after some time!',
        );
      }

      const subject = 'Verify Your PharmaStock Account';
      const body = `<p>Hello ${signUpStaffInput.name},</p> 
        <p>Thank you for registering. Please click the link below to verify your account:</p>
        <a href="${process.env.BASE_URL}/token?confirmation_token=${confirmationToken}">Verify Account</a>
        <p>If you didn’t create this account, please ignore this email.</p>
        <p>Best regards,<br>The PharmaStock Team</p>
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
        success:
          'Thank you for signing up! Please check your email to confirm your account.',
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

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<ForgotPasswordResponse> {
    const user = await this.usersService.findOne(forgotPasswordInput.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { email, id, name } = user;

    const confirmationToken = await generateToken();

    const passwordText = await generateInvitePassword();

    const password = await bcrypt.hash(passwordText, 10);

    const subject = 'Forgot Password Request!';
    const body = `<p>Hello ${name}</p>
        <p>We received a request to reset the password for your PharmaStock account. To ensure the security of your account, please click the link below to set a new password:</p> 
        <a href="${process.env.BASE_URL}/set-password?confirmation_token=${confirmationToken}">Set Your Password</a>
        <p>Temporary Password: ${passwordText}</p>
        <p>Thank you,<br>The PharmaStock Team</p>
        `;

    const emailSent = await this.emailService.run(email, subject, body);

    if (!emailSent) {
      throw new InternalServerErrorException(
        'Failed to send confirmation email!',
      );
    }

    try {
      await this.usersService.updateUser(id, {
        emailConfirmationToken: confirmationToken,
        password,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate confirmation token!',
      );
    }

    return { token: confirmationToken };
  }

  async validateForgotPasswordToken(
    forgotPasswordConfirmationInput: ForgotPasswordConfirmationInput,
  ): Promise<ValidateForgotPasswordResponse> {
    const { confirmationToken, newPassword } = forgotPasswordConfirmationInput;
    const user = await this.usersService.findOneByToken(confirmationToken);
    const { id } = user;

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const password = await bcrypt.hash(newPassword, 10);
    try {
      await this.usersService.updateUser(id, {
        emailConfirmationToken: null,
        password,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate confirmation token!',
      );
    }

    return { message: 'Password has been reset. Try loggin in.' };
  }
}
