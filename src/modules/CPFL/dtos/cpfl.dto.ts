import { IsBoolean, IsString } from 'class-validator'

export class CPFLLoginDTO {
  @IsString()
  email: string

  @IsString()
  password: string
}

export class CPFLFindInstallationDTO {
  @IsString()
  installationId: string
}

export class CPFLDownloadBillDTO {

  @IsString()
  CodEmpresaSAP: string

  @IsString()
  CodigoClasse: string

  @IsString()
  CodigoFase: string

  @IsString()
  ContaContrato: string

  @IsString()
  IndGrupoA: string

  @IsString()
  Instalacao: string

  @IsString()
  ParceiroNegocio: string

  @IsBoolean()
  RetornarDetalhes: boolean

  @IsString()
  Situacao: string
}