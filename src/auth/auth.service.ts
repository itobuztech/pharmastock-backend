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
import { generateToken } from '../util/helper';
import {
  ForgotPasswordConfirmationInput,
  ForgotPasswordInput,
} from './dto/forgot-password';
import {
  ForgotPasswordResponse,
  ValidateForgotPasswordResponse,
} from './dto/forgot-password-response';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
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

  async signup(signupUserInput: CreateUserInput) {
    try {
      const user = await this.usersService.findOne(signupUserInput.email);

      if (user) {
        throw new Error('User already exists');
      }

      const password = signupUserInput.password;
      const confirmationToken = await generateToken();

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

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<ForgotPasswordResponse> {
    const user = await this.usersService.findOne(forgotPasswordInput.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { email, id, name } = user;

    const confirmationToken = await generateToken();
    const subject = 'Forgot Password Request!';
    const body = `<p>Hello ${name}</p>
        <p>We received a request to reset the password for your [Service Name] account. To ensure the security of your account, please click the link below to set a new password:.</p> 
        <p>By clicking on this link ${process.env.BASE_URL}/forgotpasswordconfirmation?confirmation_token=${confirmationToken}</p> 
        <p>Thanks</p>`;

    const emailSent = await this.emailService.run(email, subject, body);

    if (!emailSent) {
      throw new InternalServerErrorException(
        'Failed to send confirmation email!',
      );
    }

    try {
      await this.usersService.updateUser(id, {
        emailConfirmationToken: confirmationToken,
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
