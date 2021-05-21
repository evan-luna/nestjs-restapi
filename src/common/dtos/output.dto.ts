import { IsBoolean, IsObject, IsString } from 'class-validator';

export class Output {
  @IsBoolean()
  ok: boolean;

  @IsString()
  error?: string;
}

export class CheckAPIServerOutput {
  @IsString()
  status: string;

  @IsString()
  value: string;

  @IsObject()
  data: Record<string, any>;

  @IsString()
  message: string;
}
