// Generated by https://quicktype.io

export interface User {
  id: number
  username: string
  phone: string
  name: string
  address: string
  status: string
  cccd: string
  note: string
  avatar: null
  created_at: string
  updated_at: string
  all_roles: string[]
  all_permissions: string[]
  roles?: Role[]
}

export interface Role {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
  pivot: Pivot
}

export interface Pivot {
  model_id: number
  role_id: number
  model_type: string
}

export interface LoginParams {
  email: string
  password: string
  type?: number
}

export interface RoleInfo {
  name: string
  id: string
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  access_token: string
  expires_in: number
  token_type?: string
  user: User
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[]
  id: number
  fullname: string
  shortname: string
  email: string
  max_id: number
  phone: string
  link_id?: number
  telegram_session?: string
}

export interface ChangePasswordParams {
  password: string
  old_password: string
  password_confirmation: string
}

export interface FirstChangePasswordParams {
  password: string
  password_confirmation: string
}

export interface GetCodeParams {
  phone: string
}

export interface ResetPasswordParams {
  phone: string
  code: string
  password: string
  password_confirmation: string
}

export interface VerifySmsParams {
  phone: string
  code: string
}

export interface UpdateInfoParams {
  fullname: string
}
